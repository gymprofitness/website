"use client";
import React, { useState } from "react";
import { IPlan } from "@/interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import PulsatingDotsSpinner from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { deletePlanById } from "@/actions/plans";

function PlansTable({ plans }: { plans: IPlan[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const columns = [
    "Name",
    "Monthly Price",
    "Quarterly Price",
    "Half Yearly Price",
    "Yearly Price",
    "Created At",
    "Actions",
  ];

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setDeletingPlanId(id);

      const response = await deletePlanById(id);

      if (response.success) {
        toast.success(response.message);
        // Refresh the page to show updated data
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

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 z-10">
          <PulsatingDotsSpinner parentHeight="100%" />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow
              key={plan.id}
              className={`transition-opacity duration-300 ${
                deletingPlanId === plan.id ? "opacity-50" : ""
              }`}
            >
              <TableCell>{plan.name}</TableCell>
              <TableCell>₹{plan.monthly_price}</TableCell>
              <TableCell>₹{plan.quarterly_price}</TableCell>
              <TableCell>₹{plan.half_yearly_price}</TableCell>
              <TableCell>₹{plan.yearly_price}</TableCell>
              <TableCell>
                {dayjs(plan.created_at).format("MMMM DD, YYYY hh:mm A")}
              </TableCell>
              <TableCell>
                <div className="flex gap-5">
                  <Button
                    size={"icon"}
                    onClick={() =>
                      router.push(`/account/admin/plans/edit/${plan.id}`)
                    }
                    disabled={loading}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    size={"icon"}
                    variant="destructive"
                    onClick={() => handleDelete(plan.id)}
                    disabled={loading}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PlansTable;
