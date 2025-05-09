"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import dayjs from "dayjs";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import AdminDashboard from "./_components/admin-dashboard";

function AccountPage() {
  const { user, currentSubscription } = usersGlobalStore() as IUsersGlobalStore;

  if (user?.is_admin) {
    return <AdminDashboard />;
  }

  return (
    <div>
      <PageTitle title={`Welcome ${user?.name}!`} />

      {!currentSubscription ? (
        <div className="mt-7 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex flex-col space-y-5">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You don't have any active subscription at the moment. Please
              subscribe to enjoy our services.
            </p>
            <Button className="w-max bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center justify-center">
              <Link
                href="/account/user/purchase-plan"
                className="flex items-center"
              >
                <CreditCard size={16} className="mr-2" /> View Subscription
                Plans
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-7">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Your Current Subscription
                </h3>
                <span className="px-2 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  Active
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Subscription ID
                  </span>
                  <span className="font-medium">{currentSubscription?.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Plan
                  </span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {currentSubscription?.plan?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Purchased On
                  </span>
                  <span className="font-medium">
                    {dayjs(currentSubscription?.created_at).format(
                      "MMM DD, YYYY"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Start Date
                  </span>
                  <span className="font-medium">
                    {dayjs(currentSubscription?.start_date).format(
                      "MMM DD, YYYY"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    End Date
                  </span>
                  <span className="font-medium">
                    {dayjs(currentSubscription?.end_date).format(
                      "MMM DD, YYYY"
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Duration
                  </span>
                  <span className="font-medium">
                    {currentSubscription?.total_duration} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Amount
                  </span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    ₹{currentSubscription?.amount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Payment ID
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className="font-medium max-w-[120px] truncate text-right cursor-pointer hover:text-orange-500 transition-colors"
                      title={currentSubscription?.payment_id}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          currentSubscription?.payment_id || ""
                        );
                        toast.success("Payment ID copied to clipboard");
                      }}
                    >
                      {currentSubscription?.payment_id}
                    </span>
                    <button
                      className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          currentSubscription?.payment_id || ""
                        );
                        toast.success("Payment ID copied to clipboard");
                      }}
                      title="Copy to clipboard"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <Button className="w-max bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center justify-center">
                  <Link href="/account/user/subscriptions">
                    View All Subscriptions
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
