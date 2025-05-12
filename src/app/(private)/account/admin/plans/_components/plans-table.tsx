"use client";
import React, { useState, useMemo, Suspense } from "react";
import { IPlan } from "@/interfaces";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, ArrowUpDown, ArrowDown, ArrowUp, Plus, Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { deletePlanById } from "@/actions/plans";
import { Input } from "@/components/ui/input";

type SortField = "name" | "monthly_price" | "quarterly_price" | "half_yearly_price" | "yearly_price" | "created_at";
type SortDirection = "asc" | "desc";

// Create a separate component that uses useSearchParams
function SearchablePlansTable({ plans }: { plans: IPlan[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("monthly_price");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Get search query from URL or default to empty string
  const searchQuery = searchParams.get("search") || "";
  const [search, setSearch] = useState(searchQuery);
  
  // Update URL when search changes
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    
    // Update URL with search param
    router.push(`${pathname}?${createQueryString("search", newSearch)}`);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "monthly_price", label: "Monthly Price" },
    { key: "quarterly_price", label: "Quarterly Price" },
    { key: "half_yearly_price", label: "Half Yearly Price" },
    { key: "yearly_price", label: "Yearly Price" },
    { key: "created_at", label: "Created At" },
  ];

  const filteredAndSortedPlans = useMemo(() => {
    // First filter plans by search query
    const filtered = plans.filter(plan => 
      plan.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Then sort the filtered plans
    return [...filtered].sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortField === "created_at") {
        return sortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortDirection === "asc"
          ? a[sortField] - b[sortField]
          : b[sortField] - a[sortField];
      }
    });
  }, [plans, sortField, sortDirection, searchQuery]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setDeletingPlanId(id);

      const response = await deletePlanById(id);

      if (response.success) {
        toast.success(response.message);
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the plan");
    } finally {
      setLoading(false);
      setDeletingPlanId(null);
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

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-20 backdrop-blur-sm rounded-xl">
          <Spinner parentHeight="100%" />
        </div>
      )}
      
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search plans..."
              value={search}
              onChange={handleSearch}
              className="w-full md:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 pl-10"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
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
        <Button 
          onClick={() => router.push('/account/admin/plans/add')}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <Spinner parentHeight={20} /> : <><Plus size={16} className="mr-2" /> Add New Plan</>}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedPlans.length === 0 ? (
          <div className="col-span-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? `No plans found matching "${searchQuery}"` : "No plans found"}
            </p>
          </div>
        ) : (
          filteredAndSortedPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 ${
                deletingPlanId === plan.id ? "opacity-50" : ""
              }`}
            >
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">{plan.name}</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => router.push(`/account/admin/plans/edit/${plan.id}`)}
                      className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center"
                      disabled={loading}
                    >
                      {loading && deletingPlanId === plan.id ? <Spinner parentHeight={16} /> : <Edit2 size={14} />}
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id)}
                      className="p-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center"
                      disabled={loading}
                    >
                      {loading && deletingPlanId === plan.id ? <Spinner parentHeight={16} /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Monthly</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">₹{plan.monthly_price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Quarterly</span>
                    <span className="font-medium">₹{plan.quarterly_price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Half Yearly</span>
                    <span className="font-medium">₹{plan.half_yearly_price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Yearly</span>
                    <span className="font-medium">₹{plan.yearly_price}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created on {dayjs(plan.created_at).format("MMMM DD, YYYY")}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Main component that wraps the searchable table in a Suspense boundary
function PlansTable({ plans }: { plans: IPlan[] }) {
  return (
    <Suspense fallback={
      <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
        <Spinner parentHeight="200px" />
        <p className="text-gray-500 dark:text-gray-400 mt-4">Loading plans...</p>
      </div>
    }>
      <SearchablePlansTable plans={plans} />
    </Suspense>
  );
}

export default PlansTable;
