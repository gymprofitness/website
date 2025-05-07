"use client";
import userGlobalStore, { IUsersGlobalStore } from "@/global-store/users-store";
import React from "react";

function UserProfilePage() {
  const { user } = userGlobalStore() as IUsersGlobalStore;
  return (
    <div>
      <h1>Welcome {user?.name}! This your profile page.</h1>
    </div>
  );
}

export default UserProfilePage;
