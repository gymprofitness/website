"use server";
import { supabase } from "@/config/supabase-config";

export const createNewSubscription = async (payload: any) => {
  try {
    console.log("Creating subscription with payload:", payload);
    const { data, error } = await supabase
      .from("subscriptions")
      .insert([payload]);
    if (error) {
      console.error("Supabase error:", error);
      throw new Error(error.message);
    }
    console.log("Subscription created successfully:", data);
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
