'use server';

import { revalidatePath } from 'next/cache';

import { connectToDatabase } from '@/lib/database';
import { Order, User, Event } from '@/lib/database/models';
import { handleError } from '@/lib/utils';

import { CreateUserParams, UpdateUserParams } from '@/types/parameters.types';
import { auth } from '@clerk/nextjs';

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return newUser.toJSON();
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');
    return user.toJSON();
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error('User update failed');
    return updatedUser.toJSON();
  } catch (error) {
    handleError(error);
  }
}

// TODO! Fix issues
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { organizer: { $in: userToDelete._id } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany(
        { organizer: { $in: userToDelete._id } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath('/');

    return deletedUser ? deletedUser.toJSON() : null;
  } catch (error) {
    handleError(error);
  }
}

// This is one of the main arguments to move away from Clerk, new users don't always have the
// userId in the sessions claims as it requires the webhook to complete before getting userId
export async function getSessionUserId(): Promise<string | null> {
  const { sessionClaims } = auth();

  if (sessionClaims?.userId) {
    return sessionClaims.userId;
  }

  if (sessionClaims?.sub) {
    const clerkId = sessionClaims.sub;
    const user = await User.findOne({ clerkId });

    if (!user) return null;

    return user.toJSON()._id.toString();
  }

  return null;
}
