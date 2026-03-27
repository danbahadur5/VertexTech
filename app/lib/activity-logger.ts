import { Activity, AppUser } from "../models";
import { connectDB } from "./db";
import { logger } from "./logger";

export type ActivityType = "user" | "content" | "support" | "system";

export async function logActivity({
  userId,
  action,
  type = "system",
  targetId,
  targetName,
  metadata = {},
}: {
  userId: string;
  action: string;
  type?: ActivityType;
  targetId?: string;
  targetName?: string;
  metadata?: any;
}) {
  try {
    await connectDB();
    
    // Fetch user details for the log
    const user = await AppUser.findOne({ authUserId: userId } as any);
    
    if (!user) {
      logger.warn(`Cannot log activity: user ${userId} not found in AppUser model`);
      return;
    }

    const activity = await Activity.create({
      userId,
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      action,
      type,
      targetId,
      targetName,
      metadata,
    });

    logger.debug(`Activity logged: ${action} by ${user.name}`);
    return activity;
  } catch (error) {
    logger.error("Error logging activity:", error);
  }
}
