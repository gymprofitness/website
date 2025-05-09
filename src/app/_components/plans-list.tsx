"use client";
import { getAllPlans } from "@/actions/plans";
import { IPlan } from "@/interfaces";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function PlansList() {
  const [plans, setPlans] = React.useState<IPlan[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedBillingCycle, setSelectedBillingCycle] = React.useState("monthly");
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await getAllPlans();
      if (response.success && response.data) {
        // Sort plans by monthly price
        const sortedPlans = response.data.sort(
          (a: IPlan, b: IPlan) => a.monthly_price - b.monthly_price
        );
        setPlans(sortedPlans);
      } else {
        setPlans([]);
        toast.error(response.message || "Failed to load plans");
      }
    } catch (error) {
      toast.error("Error fetching plans");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const getPriceByBillingCycle = (plan: IPlan) => {
    switch (selectedBillingCycle) {
      case "monthly":
        return plan.monthly_price;
      case "quarterly":
        return plan.quarterly_price;
      case "half_yearly":
        return plan.half_yearly_price;
      case "yearly":
        return plan.yearly_price;
      default:
        return plan.monthly_price;
    }
  };

  const getBillingLabel = () => {
    switch (selectedBillingCycle) {
      case "monthly":
        return "month";
      case "quarterly":
        return "quarter";
      case "half_yearly":
        return "6 months";
      case "yearly":
        return "year";
      default:
        return "month";
    }
  };

  const handleChoosePlan = () => {
    if (isSignedIn) {
      router.push("/account/user/purchase-plan");
    } else {
      // Show toast notification when user is not signed in
      toast.error("Please sign in to choose a plan", {
        duration: 3000,
        position: "top-center",
        icon: "🔒",
      });
      
      // Redirect to sign-in page after a short delay
      setTimeout(() => {
        router.push("/?form=sign-in");
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
        <span className="ml-2 text-lg text-gray-200">Loading plans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Billing cycle toggle */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold text-white">Select Billing Cycle</h2>
        <div className="inline-flex p-1 bg-gray-800 rounded-lg">
          {[
            { id: "monthly", label: "Monthly" },
            { id: "quarterly", label: "Quarterly" },
            { id: "half_yearly", label: "Half Yearly" },
            { id: "yearly", label: "Yearly" },
          ].map((cycle) => (
            <button
              key={cycle.id}
              onClick={() => setSelectedBillingCycle(cycle.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                selectedBillingCycle === cycle.id
                  ? "bg-orange-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {cycle.label}
            </button>
          ))}
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 text-lg">No plans available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const isPopular = index === 1 && plans.length > 2; // Make the second plan popular if there are more than 2 plans
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl overflow-hidden transition-all duration-300 ${
                  isPopular 
                    ? "border-2 border-orange-500 transform hover:-translate-y-2" 
                    : "border border-gray-700 hover:border-orange-600 hover:border-2"
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                
                {/* Plan image */}
                <div className="relative h-48 w-full overflow-hidden">
                  {plan.images && plan.images.length > 0 ? (
                    <img
                      src={plan.images[0]}
                      alt={plan.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{plan.name}</h2>
                </div>
                
                {/* Plan content */}
                <div className="flex flex-col flex-grow p-5 bg-gray-900">
                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-gray-800">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-extrabold text-white">₹{getPriceByBillingCycle(plan)}</span>
                      <span className="ml-1 text-sm text-gray-400">/{getBillingLabel()}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{plan.description}</p>
                  </div>
                  
                  {/* Features */}
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-gray-400 mb-3">Features</h3>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-orange-500 flex-shrink-0 mr-2" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <button 
                    onClick={handleChoosePlan}
                    className={`mt-6 w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isPopular 
                        ? "bg-orange-600 hover:bg-orange-700 text-white" 
                        : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    }`}
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PlansList;
