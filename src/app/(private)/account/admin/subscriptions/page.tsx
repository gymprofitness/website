"use client";
import React, { useState, useMemo } from "react";
import { getAllSubscriptions } from "@/actions/subscriptions";
import PageTitle from "@/components/ui/page-title";
import { ISubscription } from "@/interfaces";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import Spinner from "@/components/ui/spinner";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

type SortField = "id" | "created_at" | "user" | "start_date" | "end_date" | "plan" | "amount" | "payment_id";
type SortDirection = "asc" | "desc";

function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const columns = [
    { key: "id", label: "Subscription ID" },
    { key: "created_at", label: "Purchase Date" },
    { key: "user", label: "Customer" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount" },
    { key: "payment_id", label: "Payment ID" },
  ];

  const getData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllSubscriptions();
      if (!response.success) {
        throw new Error(response.message);
      }
      setSubscriptions(response.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp size={14} className="ml-1 text-orange-500" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-orange-500" />
    );
  };

  const sortedSubscriptions = useMemo(() => {
    return [...subscriptions].sort((a, b) => {
      if (sortField === "user") {
        return sortDirection === "asc" 
          ? (a.user?.name || "").localeCompare(b.user?.name || "") 
          : (b.user?.name || "").localeCompare(a.user?.name || "");
      } else if (sortField === "plan") {
        return sortDirection === "asc" 
          ? (a.plan?.name || "").localeCompare(b.plan?.name || "") 
          : (b.plan?.name || "").localeCompare(a.plan?.name || "");
      } else if (["created_at", "start_date", "end_date"].includes(sortField)) {
        return sortDirection === "asc"
          ? new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime()
          : new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime();
      } else {
        if (sortField === "amount") {
          return sortDirection === "asc"
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        }
        return sortDirection === "asc"
          ? String(a[sortField]).localeCompare(String(b[sortField]))
          : String(b[sortField]).localeCompare(String(a[sortField]));
      }
    });
  }, [subscriptions, sortField, sortDirection]);

  return (
    <div className="relative">
      <PageTitle title="All Subscriptions" />
      
      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-20 backdrop-blur-sm rounded-xl">
          <Spinner parentHeight="100%" />
        </div>
      )}
      
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
          {columns.map((column) => (
            <button
              key={column.key}
              onClick={() => handleSort(column.key as SortField)}
              className={`px-3 py-1.5 text-sm rounded-full flex items-center transition-colors ${
                sortField === column.key 
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {column.label}
              {renderSortIcon(column.key)}
            </button>
          ))}
        </div>
      </div>

      {!subscriptions.length && !loading && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">No subscriptions found in the system.</p>
        </div>
      )}

      {subscriptions.length > 0 && !loading && (
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">All Subscriptions</h3>
              <span className="px-2 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                {subscriptions.length} Total
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50">
                    {columns.map((column) => (
                      <th 
                        key={column.key}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                        onClick={() => handleSort(column.key as SortField)}
                      >
                        <div className="flex items-center">
                          {column.label}
                          {renderSortIcon(column.key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedSubscriptions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {dayjs(item.created_at).format("MMM DD, YYYY")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{item.user?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {dayjs(item.start_date).format("MMM DD, YYYY")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {dayjs(item.end_date).format("MMM DD, YYYY")}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-orange-600 dark:text-orange-400">{item.plan?.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">₹{item.amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        <span className="max-w-[120px] truncate inline-block" title={item.payment_id}>
                          {item.payment_id}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSubscriptions;
