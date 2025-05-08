"use client";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  // You can use useEffect to verify the payment if needed
  useEffect(() => {
    // Optional: Verify payment status with your backend
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <PageTitle title="Payment Successful" />

      <div className="mt-8 p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Payment Successful
          </h2>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully.
          </p>

          <Button asChild>
            <a href="/account/user/dashboard">Go to Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
