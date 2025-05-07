"use client";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import userGlobalStore, { IUsersGlobalStore } from "@/global-store/users-store";
import Link from "next/link";
import React from "react";

function AccountPage() {
  const { user } = userGlobalStore() as IUsersGlobalStore;
  return (
    <div>
      <PageTitle title={`Welcome ${user?.name}!`} />

      <div className="flex flex-col space-y-5 mt-5">
        {/* this message will be dynamic in future */}
        <p className="text-sm text-gray-600">
          You dont have any active subscription at the moment. Please subscribe
          to enjoy our services.
        </p>
        <Button className="w-max">
          <Link href="/account/user/purchase-plan">
            View Subscripiton Plans
          </Link>
        </Button>
      </div>
    </div>
  );
}
export default AccountPage;
