'use server';

import { revalidatePath } from 'next/cache';

import { connectToDatabase } from '@/lib/database';
import {
  UserModel,
  EventModel,
  IUser,
  CreateUserMongoParams,
} from '@/lib/database/models';
import { handleError } from '@/lib/utils';

import { auth } from '@clerk/nextjs/server';
import { JwtPayload } from '@clerk/types';
import { ToJSON } from '@/types/utility.types';
import {
  checkAndReturnObjectId,
  documentToJSON,
} from '@/lib/utils/mongoose.utils';
import { Types } from 'mongoose';

export async function createUser(
  user: CreateUserMongoParams
): Promise<ToJSON<IUser> | undefined> {
  try {
    await connectToDatabase();

    const newUser = await UserModel.create(user);
    return documentToJSON(newUser);
  } catch (error) {
    handleError(error);
  }
}

export async function getUserById(
  userId: string | Types.ObjectId
): Promise<ToJSON<IUser> | undefined> {
  try {
    await connectToDatabase();

    const userObjectId = checkAndReturnObjectId(userId);

    const user = await UserModel.findById(userObjectId);

    if (!user) throw new Error('User not found');

    return documentToJSON(user);
  } catch (error) {
    handleError(error);
  }
}

export async function updateUserByClerkId(
  clerkId: string,
  user: Partial<CreateUserMongoParams>
): Promise<ToJSON<IUser> | undefined> {
  try {
    await connectToDatabase();

    const updatedUser = await UserModel.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error('User update failed');

    return documentToJSON(updatedUser);
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
    const userToDelete = await UserModel.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      EventModel.updateMany(
        { createdBy: { $in: userToDelete._id } },
        { $pull: { createdBy: userToDelete._id } }
      ),
    ]);

    // Delete user
    const deletedUser = await UserModel.findByIdAndDelete(userToDelete._id);

    if (!deletedUser) throw new Error('Problem deleting user');

    revalidatePath('/');

    return documentToJSON<IUser>(deletedUser);
  } catch (error) {
    handleError(error);
  }
}

// This is one of the main arguments to move away from Clerk, new users don't always have the
// userId in the sessions claims as it requires the webhook to complete before getting userId
export async function getSessionUserId(): Promise<string | null> {
  const { sessionClaims } = await auth();
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
  const user = await UserModel.findOne({ clerkId });

  if (!user) return null;

  return user._id.toString();
}
