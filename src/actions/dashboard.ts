"use server";

import supabase from "@/config/supabase-config";

export const getUsersReport = async () => {
  try {
    const { data, error } = await supabase.rpc("users_reports");

    if (error) {
      console.error("Users report error:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      data: data[0],
    };
  } catch (error: any) {
    console.error("Users report exception:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSubscriptionsReport = async () => {
  try {
    const { data, error } = await supabase.rpc("subscriptions_reports");

    if (error) {
      console.error("Subscriptions report error:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      data: data[0] || { subscriptions_count: 0, total_revenue: 0 },
    };
  } catch (error: any) {
    console.error("Subscriptions report exception:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getMonthlyRevenueReport = async () => {
  try {
    const { data, error } = await supabase.rpc("monthly_revenue_report");

    if (error) {
      console.error("Monthly revenue report error:", error);
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error("Monthly revenue report exception:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
