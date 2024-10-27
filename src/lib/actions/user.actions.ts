'use server';

import { revalidatePath } from 'next/cache';

import { connectToDatabase } from '@/lib/database';
import { User, Event, IUser } from '@/lib/database/models';
import { handleError } from '@/lib/utils';

import { CreateUserParams, UpdateUserParams } from '@/types/parameters.types';
import { auth } from '@clerk/nextjs';
import { JwtPayload } from '@clerk/types';
import { ToJSON } from '@/types/utility.types';
import { documentToJson } from '@/lib/utils/mongoose.utils';

export async function createUser(
  user: CreateUserParams
): Promise<ToJSON<IUser> | undefined> {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return documentToJson(newUser);
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(
  userId: string
): Promise<ToJSON<IUser> | undefined> {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    return documentToJson(user);
  } catch (error) {
    handleError(error);
  }
}

export async function updateUser(
  clerkId: string,
  user: UpdateUserParams
): Promise<ToJSON<IUser> | undefined> {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error('User update failed');

    return documentToJson(updatedUser);
  } catch (error) {
    handleError(error);
  }
}

export async function deleteUser(
  clerkId: string
): Promise<ToJSON<IUser> | undefined> {
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
    ]);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    if (!deletedUser) throw new Error('Problem deleting user');

    revalidatePath('/');

    return documentToJson<IUser>(deletedUser);
  } catch (error) {
    handleError(error);
  }
}

// This is one of the main arguments to move away from Clerk, new users don't always have the
// userId in the sessions claims as it requires the webhook to complete before getting userId
export async function getSessionUserId(): Promise<string | null> {
  const { sessionClaims } = auth();
  if (!sessionClaims) return null;

  return await getUserIdFromSessionClaims(sessionClaims);
}

export async function getUserIdFromSessionClaims(
  sessionClaims: JwtPayload
): Promise<string | null> {
  if (sessionClaims?.userId) {
    return sessionClaims.userId;
  }

  if (!sessionClaims?.sub) return null;

  const clerkId = sessionClaims.sub;
  const user = await User.findOne({ clerkId });

  if (!user) return null;

  return user._id.toString();
}
