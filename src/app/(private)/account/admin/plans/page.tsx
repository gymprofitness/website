import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import React from "react";
import Link from "next/link";
import { getAllPlans } from "@/actions/plans";
import toast from "react-hot-toast";
import PlansTable from "./_components/plans-table";

async function AdminPlansPage() {
  const responce: any = await getAllPlans();
  if (!responce.success) {
    return <div>{responce.message}</div>;
  }
  console.log(responce.data);
  return (
    <div>
      <div className="flex justify-between item-centre">
        <PageTitle title="Plans" />
      </div>
      <PlansTable plans={responce.data} />
    </div>
  );
}

export default AdminPlansPage;
