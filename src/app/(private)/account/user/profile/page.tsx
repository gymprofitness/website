"use client";
import React from "react";
import userGlobalStore, { IUsersGlobalStore } from "@/global-store/users-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  User,
  Key,
  Calendar,
  Shield,
  Briefcase,
  Phone,
} from "lucide-react";
import PageTitle from "@/components/ui/page-title";
import dayjs from "dayjs";

//clerk pusblish mode . check

function UserProfilePage() {
  const { user } = userGlobalStore() as IUsersGlobalStore;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-6">
      <PageTitle title="My Profile" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user?.avatar_url || ""} alt={user?.name} />
              <AvatarFallback className="text-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-center">{user?.name}</CardTitle>
            <CardDescription className="text-center flex items-center justify-center">
              <Mail className="h-4 w-4 mr-1" /> {user?.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">Account Type:</span>
                <span className="ml-auto font-medium">
                  {user?.is_admin ? "Administrator" : "Regular User"}
                </span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">Status:</span>
                <span className="ml-auto font-medium">
                  {user?.is_active ? (
                    <span className="text-green-600 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-600 mr-1"></span>{" "}
                      Active
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-red-600 mr-1"></span>{" "}
                      Inactive
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">Joined:</span>
                <span className="ml-auto font-medium">
                  {dayjs(user?.created_at).format("MMMM D, YYYY")}
                </span>
              </div>
              <div className="flex items-center">
                <Key className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm text-gray-500">User ID:</span>
                <span className="ml-auto font-medium text-xs text-gray-600">
                  {user?.id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Personal Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Full Name
                          </p>
                          <p className="font-medium">
                            {user?.name || "Not provided"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Email Address
                          </p>
                          <p className="font-medium">
                            {user?.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Account Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Account ID
                          </p>
                          <p className="font-medium">
                            {user?.id || "Not available"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Account Type
                          </p>
                          <p className="font-medium">
                            {user?.is_admin ? "Administrator" : "Regular User"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Account Status
                          </p>
                          <p className="font-medium">
                            {user?.is_active ? (
                              <span className="text-green-600">Active</span>
                            ) : (
                              <span className="text-red-600">Inactive</span>
                            )}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500">
                            Member Since
                          </p>
                          <p className="font-medium">
                            {dayjs(user?.created_at).format("MMMM D, YYYY")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent actions and activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">
                      No Recent Activity
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mt-2">
                      Your recent activities will appear here once you start
                      using the platform more.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
