"use client";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { XCircle } from "lucide-react";

export default function PaymentFailurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <PageTitle title="Payment Failed" />

      <div className="mt-8 p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-6">
            Your payment could not be processed. Please try again.
          </p>

          <Button asChild>
            <a href="/account/user/purchase-plan">Try Again</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
