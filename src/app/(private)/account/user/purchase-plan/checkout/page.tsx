"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTitle from "@/components/ui/page-title";
import {
  IPlansGlobalStore,
  plansGlobalStore,
} from "@/global-store/plans-store";
import dayjs from "dayjs";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { ArrowRight, Calendar, CreditCard, Package, Tag } from "lucide-react";
import { initiatePayuPayment } from "@/actions/payments";

function CheckoutPage() {
  const { selectedPaymentPlan } = plansGlobalStore() as IPlansGlobalStore;
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [isProcessing, setIsProcessing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const endDate = useMemo(() => {
    return dayjs(startDate)
      .add(selectedPaymentPlan?.paymentPlan?.duration ?? 0, "day")
      .format("YYYY-MM-DD");
  }, [startDate, selectedPaymentPlan]);

  // Generate a unique transaction ID
  const generateTxnId = () => {
    return `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };

  const initiatePayment = async () => {
    try {
      setIsProcessing(true);
      
      if (!selectedPaymentPlan) {
        throw new Error("No plan selected");
      }

      const txnid = generateTxnId();
      const response = await initiatePayuPayment({
        txnid,
        amount: selectedPaymentPlan.paymentPlan?.price || 0,
        productinfo: selectedPaymentPlan.mainPlan?.name || "Subscription Plan",
        firstname: "User", // Replace with actual user data
        email: "user@example.com", // Replace with actual user data
        phone: "9999999999", // Replace with actual user data
      });

      if (response && response.success) {
        setPaymentData(response.data);
      } else {
        throw new Error(response?.message || "Payment initiation failed");
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      alert(`Payment initiation failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit form when payment data is available
  useEffect(() => {
    if (paymentData && formRef.current) {
      formRef.current.submit();
    }
  }, [paymentData]);

  if (!selectedPaymentPlan) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle title="Checkout" />
        <div className="mt-8 p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            No Plan Selected
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't selected a plan yet. Please go back to the plans page
            and choose a plan.
          </p>
          <Button asChild>
            <a href="/account/user/purchase-plan">Browse Plans</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <PageTitle title="Complete Your Purchase" />

      <div className="mt-8">
        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Order Summary
            </h2>
            <p className="text-sm text-gray-500">
              Review your subscription details
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {selectedPaymentPlan.mainPlan?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedPaymentPlan.paymentPlan?.planName} Plan
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center text-gray-700">
                  <Tag className="h-4 w-4 mr-2" />
                  <span>Subscription Price</span>
                </div>
                <span className="font-medium text-gray-900">
                  ₹{selectedPaymentPlan.paymentPlan?.price}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Billing Period</span>
                </div>
                <span className="font-medium text-gray-900">
                  {selectedPaymentPlan.paymentPlan?.duration} days
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center text-gray-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Start Date</span>
                </div>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40 text-right"
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center text-gray-700">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <span>End Date</span>
                </div>
                <span className="font-medium text-gray-900">{endDate}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-700">Total Amount</span>
                <span className="text-xl font-bold text-gray-900">
                  ₹{selectedPaymentPlan.paymentPlan?.price}
                </span>
              </div>

              <Button
                className="w-full h-11 text-base font-medium mt-4"
                onClick={initiatePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>Pay Now</>
                )}
              </Button>

              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs text-gray-500">Secure payment</span>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 mt-4">
                By proceeding with the payment, you agree to our terms and
                conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden form for PayU submission */}
      {paymentData && (
        <form
          ref={formRef}
          method="post"
          action={paymentData.environment === "TEST" ? "https://test.payu.in/_payment" : "https://secure.payu.in/_payment"}
          style={{ display: "none" }}
        >
          <input type="hidden" name="key" value={paymentData.key} />
          <input type="hidden" name="txnid" value={paymentData.txnid} />
          <input type="hidden" name="amount" value={paymentData.amount} />
          <input type="hidden" name="productinfo" value={paymentData.productinfo} />
          <input type="hidden" name="firstname" value={paymentData.firstname} />
          <input type="hidden" name="email" value={paymentData.email} />
          <input type="hidden" name="phone" value={paymentData.phone} />
          <input type="hidden" name="surl" value={paymentData.surl} />
          <input type="hidden" name="furl" value={paymentData.furl} />
          <input type="hidden" name="hash" value={paymentData.hash} />
        </form>
      )}
    </div>
  );
}

export default CheckoutPage;
