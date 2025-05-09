"use client";
import React, { useState, useMemo } from "react";
import { getAllCustomers } from "@/actions/users";
import PageTitle from "@/components/ui/page-title";
import toast from "react-hot-toast";
import Spinner from "@/components/ui/spinner";
import { ArrowUpDown, ArrowDown, ArrowUp, Search } from "lucide-react";
import { IUser } from "@/interfaces";
import { Input } from "@/components/ui/input";

type SortField = "id" | "name" | "email";
type SortDirection = "asc" | "desc";

function AdminCustomersList() {
  const [customers, setCustomers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const columns = [
    { key: "id", label: "Customer ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllCustomers();
      if (!response.success) {
        toast.error("Failed to fetch customers");
      } else {
        setCustomers(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
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
    if (sortField !== field)
      return <ArrowUpDown size={14} className="ml-1 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp size={14} className="ml-1 text-orange-500" />
    ) : (
      <ArrowDown size={14} className="ml-1 text-orange-500" />
    );
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const search = searchTerm.toLowerCase();
      return (
        customer.name?.toLowerCase().includes(search) ||
        customer.email?.toLowerCase().includes(search) ||
        customer.id?.toString().includes(search)
      );
    });
  }, [customers, searchTerm]);

  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      if (sortField === "name" || sortField === "email") {
        return sortDirection === "asc"
          ? (a[sortField] || "").localeCompare(b[sortField] || "")
          : (b[sortField] || "").localeCompare(a[sortField] || "");
      } else {
        return sortDirection === "asc"
          ? Number(a.id) - Number(b.id)
          : Number(b.id) - Number(a.id);
      }
    });
  }, [filteredCustomers, sortField, sortDirection]);

  return (
    <div className="relative">
      <PageTitle title="Customers" />

      {loading && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 z-20 backdrop-blur-sm rounded-xl">
          <Spinner parentHeight="100%" />
        </div>
      )}

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-[300px]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto justify-start md:justify-end">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by:
          </span>
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

      {!customers.length && !loading && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            You do not have any customers at the moment.
          </p>
        </div>
      )}

      {customers.length > 0 && sortedCustomers.length === 0 && !loading && (
        <div className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No customers found matching your search.
          </p>
        </div>
      )}

      {sortedCustomers.length > 0 && !loading && (
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                All Customers
              </h3>
              <span className="px-2 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                {sortedCustomers.length}{" "}
                {sortedCustomers.length < customers.length
                  ? `of ${customers.length}`
                  : ""}{" "}
                Total
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
                  {sortedCustomers.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                        {item.email}
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

export default AdminCustomersList;
