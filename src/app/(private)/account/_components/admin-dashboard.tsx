import React, { useEffect, useState } from "react";
import DashboardCard from "./dashboard-card";
import RevenueChart from "./revenue-chat";

import {
  getUsersReport,
  getSubscriptionsReport,
  getMonthlyRevenueReport,
} from "@/actions/dashboard";
import toast from "react-hot-toast";
import { Users, UserCog, User, CreditCard, DollarSign } from "lucide-react";
import Spinner from "@/components/ui/spinner";

function AdminDashboard() {
  const [userData, setUserData] = useState({
    users_count: 0,
    customers_count: 0,
    admins_count: 0,
  });

  const [subscriptionData, setSubscriptionData] = useState({
    subscriptions_count: 0,
    total_revenue: 0,
  });

  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch users data
      const usersReportResponse = await getUsersReport();
      if (usersReportResponse.success) {
        setUserData(
          usersReportResponse.data || {
            users_count: 0,
            customers_count: 0,
            admins_count: 0,
          }
        );
      } else {
        console.error("User report failed:", usersReportResponse.message);
        toast.error(usersReportResponse.message);
      }

      // Fetch subscriptions data
      const subscriptionsReportResponse = await getSubscriptionsReport();

      if (subscriptionsReportResponse.success) {
        setSubscriptionData(
          subscriptionsReportResponse.data || {
            subscriptions_count: 0,
            total_revenue: 0,
          }
        );
      } else {
        console.error(
          "Subscription report failed:",
          subscriptionsReportResponse.message
        );
        toast.error(subscriptionsReportResponse.message);
      }

      // Fetch monthly revenue data
      const monthlyRevenueResponse = await getMonthlyRevenueReport();

      if (monthlyRevenueResponse.success) {
        setMonthlyRevenueData(monthlyRevenueResponse.data || []);
      } else {
        console.error(
          "Monthly revenue report failed:",
          monthlyRevenueResponse.message
        );
        toast.error(monthlyRevenueResponse.message);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-20 backdrop-blur-sm rounded-xl">
          <Spinner parentHeight="100%" />
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Users & Customers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <DashboardCard
            value={userData.users_count || 0}
            name="Total Users"
            description="Total number of users in the system"
            icon={Users}
            color="from-blue-400 to-blue-600"
          />

          <DashboardCard
            value={userData.customers_count || 0}
            name="Total Customers"
            description="Users with regular accounts"
            icon={User}
            color="from-green-400 to-green-600"
          />

          <DashboardCard
            value={userData.admins_count || 0}
            name="Total Admins"
            description="Users with administrative access"
            icon={UserCog}
            color="from-purple-400 to-purple-600"
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Subscriptions & Revenue
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DashboardCard
            value={subscriptionData.subscriptions_count || 0}
            name="Total Subscriptions"
            description="Number of active subscriptions"
            icon={CreditCard}
            color="from-orange-400 to-orange-600"
          />

          <DashboardCard
            value={subscriptionData.total_revenue || 0}
            name="Total Revenue"
            description="Revenue generated from subscriptions"
            isCurrency={true}
            icon={DollarSign}
            color="from-emerald-400 to-emerald-600"
          />
        </div>
      </div>

      <div className="mb-8">
        <RevenueChart data={monthlyRevenueData} />
      </div>
    </div>
  );
}

export default AdminDashboard;
