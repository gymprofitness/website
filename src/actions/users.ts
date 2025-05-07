"use server";
import supabase from "@/config/supabase-config";
import { currentUser } from "@clerk/nextjs/server";
import { IUser } from "@/interfaces";

// Define response types
interface UserResponse {
  success: boolean;
  data?: IUser;
  error?: string;
  updated?: boolean;
  created?: boolean;
}

// Define user data update interface
interface UserUpdateData {
  name?: string;
  email?: string;
  profile_image?: string;
  clerk_url?: string;
  is_active?: boolean;
  [key: string]: any; // For any additional fields
}

export const getCurrentUserFromSupabase = async (): Promise<UserResponse> => {
  try {
    // Get the current authenticated user from Clerk
    const clerkUser = await currentUser();

    // If no user is authenticated, return an error
    if (!clerkUser) {
      return {
        success: false,
        error: "No authenticated user found",
      };
    }

    // Check if user exists in Supabase
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("clerk_user_id", clerkUser.id);

    if (error) {
      throw error;
    }

    // If user exists, check if their details need updating
    if (data && data.length) {
      const existingUser = data[0] as IUser;
      const userNeedsUpdate =
        existingUser.email !== clerkUser.emailAddresses[0].emailAddress ||
        existingUser.name !==
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        existingUser.profile_image !== clerkUser.imageUrl;

      // If user details have changed, update them in Supabase
      if (userNeedsUpdate) {
        const { data: updatedUser, error: updateError } = await supabase
          .from("user_profiles")
          .update({
            email: clerkUser.emailAddresses[0].emailAddress,
            name: `${clerkUser.firstName || ""} ${
              clerkUser.lastName || ""
            }`.trim(),
            profile_image: clerkUser.imageUrl,
          })
          .eq("clerk_user_id", clerkUser.id)
          .select("*");

        if (updateError) {
          throw updateError;
        }

        return {
          success: true,
          data: updatedUser[0] as IUser,
          updated: true,
        };

      }

      // Return existing user if no update needed
      return {
        success: true,
        data: existingUser,
      };
    }

    // Create a new user in Supabase if they don't exist
    const newUserObj = {
      clerk_user_id: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      is_active: true,
      is_admin: false,
      profile_image: clerkUser.imageUrl,
      clerk_url: clerkUser.imageUrl, // Adding clerk_url as per your interface
    };

    const { data: newUser, error: newUserError } = await supabase
      .from("user_profiles")
      .insert([newUserObj])
      .select("*");

    if (newUserError) {
      throw newUserError;
    }

    return {
      success: true,
      data: newUser[0] as IUser,
      created: true,
    };
  } catch (error: unknown) {
    console.error("Error managing user data:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to manage user data",
    };
  }
};

// Function to explicitly update user profile
export const updateUserProfile = async (
  userData: UserUpdateData
): Promise<UserResponse> => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return {
        success: false,
        error: "No authenticated user found",
      };
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update(userData)
      .eq("clerk_user_id", clerkUser.id)
      .select("*");

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data[0] as IUser,
    };
  } catch (error: unknown) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update user profile",
    };
  }
};

// Function to sync Clerk user data with Supabase
export const syncUserWithClerk = async (): Promise<UserResponse> => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return {
        success: false,
        error: "No authenticated user found",
      };
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        profile_image: clerkUser.imageUrl,
        clerk_url: clerkUser.imageUrl,
      })
      .eq("clerk_user_id", clerkUser.id)
      .select("*");

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: data[0] as IUser,
    };
  } catch (error: unknown) {
    console.error("Error syncing user with Clerk:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to sync user with Clerk",
    };
  }
};
