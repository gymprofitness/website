"use client";
import { getAllPlans } from "@/actions/plans";
import PageTitle from "@/components/ui/page-title";
import PulsatingDotsSpinner from "@/components/ui/spinner";
import { IPlan } from "@/interfaces";
import {
  IPlansGlobalStore,
  plansGlobalStore,
} from "@/global-store/plans-store";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

// Define color scheme type
type ColorScheme = {
  accent: string;
  border: string;
  bg: string;
  text: string;
  highlight: string;
};

// Define plan colors type with specific keys
type PlanColorType = {
  basic: ColorScheme;
  standard: ColorScheme;
  premium: ColorScheme;
  enterprise: ColorScheme;
  default: ColorScheme;
};

// Define sort options
type SortOption = "name" | "price" | "popularity";

function PurchasePlanPage() {
  const { selectedPaymentPlan, setSelectedPaymentPlan } =
    plansGlobalStore() as IPlansGlobalStore;

  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("price");
  
  // Color scheme for different plan types
  const planColors: PlanColorType = {
    basic: {
      accent: "from-blue-400 to-blue-600",
      border: "border-blue-400",
      bg: "bg-blue-50",
      text: "text-blue-600",
      highlight: "bg-blue-100"
    },
    standard: {
      accent: "from-purple-400 to-purple-600",
      border: "border-purple-400",
      bg: "bg-purple-50",
      text: "text-purple-600",
      highlight: "bg-purple-100"
    },
    premium: {
      accent: "from-orange-400 to-orange-600",
      border: "border-orange-400",
      bg: "bg-orange-50",
      text: "text-orange-600",
      highlight: "bg-orange-100"
    },
    enterprise: {
      accent: "from-emerald-400 to-emerald-600",
      border: "border-emerald-400",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      highlight: "bg-emerald-100"
    },
    default: {
      accent: "from-gray-400 to-gray-600",
      border: "border-gray-400",
      bg: "bg-gray-50",
      text: "text-gray-600",
      highlight: "bg-gray-100"
    }
  };

  // Function to determine color scheme based on plan name
  const getPlanColorScheme = (planName: string): ColorScheme => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return planColors.basic;
    if (name.includes('standard')) return planColors.standard;
    if (name.includes('premium')) return planColors.premium;
    if (name.includes('enterprise')) return planColors.enterprise;
    
    // Default to a color based on index in the array
    const index = plans.findIndex(p => p.name === planName) % 4;
    const colorKeys = Object.keys(planColors) as Array<keyof PlanColorType>;
    return planColors[colorKeys[index]] || planColors.default;
  };

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

  // Sort plans based on selected criteria
  const sortedPlans = React.useMemo(() => {
    if (!plans.length) return [];
    
    return [...plans].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        return a.monthly_price - b.monthly_price;
      } else if (sortBy === "popularity") {
        // Assuming popular plans have a 'popular' property
        const aPopular = a.popular ? 1 : 0;
        const bPopular = b.popular ? 1 : 0;
        return bPopular - aPopular; // Sort popular plans first
      }
      return 0;
    });
  }, [plans, sortBy]);

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <p className="text-gray-600 max-w-3xl mb-4 md:mb-0">
              Select the plan that best fits your needs. All plans include access
              to our core features. Upgrade or downgrade at any time.
            </p>
            
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select 
                className="text-sm border-0 bg-transparent focus:ring-0 cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="price">Price (Low to High)</option>
                <option value="name">Name (A-Z)</option>
                <option value="popularity">Popularity</option>
              </select>
              <ArrowUpDown size={14} className="text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-7">
            {sortedPlans.map((plan: IPlan) => {
              const paymentPlans = getPaymentsPlans(plan);
              const isSelected = selectedPaymentPlan?.mainPlan?.id === plan.id;
              const colorScheme = getPlanColorScheme(plan.name);

              return (
                <div
                  className={`flex flex-col justify-between p-6 rounded-xl shadow-sm transition-all duration-300 relative overflow-hidden ${
                    isSelected
                      ? `border-2 ${colorScheme.border} shadow-md transform scale-[1.02]`
                      : "border border-gray-200 hover:border-gray-300 hover:shadow"
                  }`}
                  key={plan.id}
                >
                  {/* Colored accent bar at the top */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${colorScheme.accent}`}></div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h1 className={`text-xl font-bold ${isSelected ? colorScheme.text : "text-gray-900"}`}>
                        {plan.name}
                      </h1>
                      {plan.popular && (
                        <span className={`px-2 py-1 text-xs font-medium ${colorScheme.bg} ${colorScheme.text} rounded-full`}>
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
                      {plan.features?.map((feature: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <Check
                            size={16}
                            className={`${colorScheme.text} mt-0.5 flex-shrink-0`}
                          />
                          <span className="line-clamp-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <h2 className="text-sm font-bold text-gray-900">Pricing</h2>
                    <select
                      className={`border rounded-md p-2.5 w-full text-sm focus:outline-none focus:ring-2 ${
                        isSelected ? colorScheme.border : "border-gray-300"
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
                          ? `bg-gradient-to-r ${colorScheme.accent} text-white hover:opacity-90`
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
                      <p className={`text-xs text-center ${colorScheme.text} mt-1`}>
                        You selected: {selectedPaymentPlan.paymentPlan.planName}{" "}
                        plan at ₹{selectedPaymentPlan.paymentPlan.price}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Need Help Choosing?</h2>
            <p className="text-gray-600 mb-4">
              If you're not sure which plan is right for you, our team is happy to help you find the perfect fit for your needs.
            </p>
            <Button variant="outline" className="hover:bg-gray-200 transition-colors">Contact Support</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default PurchasePlanPage;
