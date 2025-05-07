"use client";
import { getAllPlans } from "@/actions/plans";
import PageTitle from "@/components/ui/page-title";
import PulsatingDotsSpinner from "@/components/ui/spinner";
import { IPlan } from "@/interfaces";
import {
  IPlansGlobalStore,
  plansGlobalStore,
} from "@/global-store/plans-store";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react"; // Import icons
import { useRouter } from "next/navigation";

function PurchasePlanPage() {
  const { selectedPaymentPlan, setSelectedPaymentPlan } =
    plansGlobalStore() as IPlansGlobalStore;

  const [plans, setPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllPlans();
      if (!response.success) {
        throw new Error(response.message);
      }
      setPlans(response.data);
    } catch (error) {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentsPlans = (plan: IPlan) => {
    return [
      {
        planName: "Monthly",
        price: plan.monthly_price,
        key: "monthly_price",
        duration: 30,
      },
      {
        planName: "Quarterly",
        price: plan.quarterly_price,
        key: "quarterly_price",
        duration: 90,
        savings: Math.round(
          (1 - plan.quarterly_price / (plan.monthly_price * 3)) * 100
        ),
      },
      {
        planName: "Half Yearly",
        price: plan.half_yearly_price,
        key: "half_yearly_price",
        duration: 180,
        savings: Math.round(
          (1 - plan.half_yearly_price / (plan.monthly_price * 6)) * 100
        ),
      },
      {
        planName: "Yearly",
        price: plan.yearly_price,
        key: "yearly_price",
        duration: 365,
        savings: Math.round(
          (1 - plan.yearly_price / (plan.monthly_price * 12)) * 100
        ),
      },
    ];
  };

  const handleCheckout = () => {
    setCheckoutLoading(true);
    // Simulate loading for demo purposes
    setTimeout(() => {
      setCheckoutLoading(false);
      window.location.href = "/account/user/purchase-plan/checkout";
    }, 1000);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageTitle title="Choose Your Plan" />

      {loading ? (
        <div className="mt-10">
          <PulsatingDotsSpinner parentHeight={300} />
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Select the plan that best fits your needs. All plans include access
            to our core features. Upgrade or downgrade at any time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-7">
            {plans.map((plan: any) => {
              const paymentPlans = getPaymentsPlans(plan);
              const isSelected = selectedPaymentPlan?.mainPlan?.id === plan.id;

              return (
                <div
                  className={`flex flex-col justify-between p-6 rounded-xl shadow-sm transition-all duration-300 ${
                    isSelected
                      ? "border-2 border-primary shadow-md transform scale-[1.02]"
                      : "border border-gray-200 hover:border-gray-300 hover:shadow"
                  }`}
                  key={plan.id}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h1 className="text-xl font-bold text-gray-900">
                        {plan.name}
                      </h1>
                      {plan.popular && (
                        <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 min-h-[40px]">
                      {plan.description}
                    </p>

                    <div className="h-px bg-gray-200 my-2"></div>

                    <h2 className="text-sm font-semibold text-gray-900 mt-1">
                      Features
                    </h2>
                    <ul className="flex flex-col gap-2 mb-4">
                      {plan.features.map((feature: any, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <Check
                            size={16}
                            className="text-primary mt-0.5 flex-shrink-0"
                          />
                          <span className="line-clamp-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <h2 className="text-sm font-bold text-gray-900">Pricing</h2>
                    <select
                      className={`border rounded-md p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        isSelected ? "border-primary" : "border-gray-300"
                      }`}
                      onChange={(e) => {
                        const selectedPlan = paymentPlans.find(
                          (paymentPlan) =>
                            paymentPlan.price === Number(e.target.value)
                        );

                        // Only set the payment plan if one is found
                        if (selectedPlan) {
                          setSelectedPaymentPlan({
                            mainPlan: plan,
                            paymentPlan: selectedPlan,
                          });
                        }
                      }}
                      value={
                        isSelected
                          ? selectedPaymentPlan?.paymentPlan?.price
                          : ""
                      }
                    >
                      <option value="">Select Payment Plan</option>
                      {paymentPlans.map((paymentPlan) => (
                        <option key={paymentPlan.key} value={paymentPlan.price}>
                          {paymentPlan.planName} - ₹{paymentPlan.price}
                          {paymentPlan.savings && paymentPlan.savings > 0
                            ? ` (Save ${paymentPlan.savings}%)`
                            : ""}
                        </option>
                      ))}
                    </select>

                    <Button
                      className={`w-full mt-2 flex items-center justify-center gap-2 ${
                        isSelected
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-gray-100 text-gray-500"
                      }`}
                      disabled={
                        !selectedPaymentPlan?.paymentPlan ||
                        selectedPaymentPlan?.mainPlan?.id !== plan.id ||
                        checkoutLoading
                      }
                      onClick={handleCheckout}
                    >
                      {checkoutLoading && isSelected ? (
                        <div className="h-5 w-5">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <>
                          Proceed to Checkout
                          <ChevronRight size={16} />
                        </>
                      )}
                    </Button>

                    {isSelected && selectedPaymentPlan?.paymentPlan && (
                      <p className="text-xs text-center text-gray-500 mt-1">
                        You selected: {selectedPaymentPlan.paymentPlan.planName}{" "}
                        plan at ₹{selectedPaymentPlan.paymentPlan.price}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-3">Need Help Choosing?</h2>
            <p className="text-gray-600 mb-4">
              If you're not sure which plan is right for you, our team is happy
              to help you find the perfect fit for your needs.
            </p>
            <Button variant="outline">Contact Support</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default PurchasePlanPage;
