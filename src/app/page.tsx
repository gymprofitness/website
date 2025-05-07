"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDown } from "lucide-react";
import { ArrowRightToLine } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignUp, SignIn } from "@clerk/nextjs";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PlansList from "./_components/plans-list";

// Create a separate component for parts that use useSearchParams
function AuthContent() {
  const searchParams = useSearchParams();
  const form = searchParams.get("form");
  
  return (
    <div className="flex items-center justify-center w-full">
      {form === "sign-up" ? (
        <SignUp
          routing="hash"
          signInUrl="/?form=sign-in"
          fallbackRedirectUrl={"/account"}
        />
      ) : (
        <SignIn
          routing="hash"
          signUpUrl="/?form=sign-up"
          fallbackRedirectUrl={"/account"}
        />
      )}
    </div>
  );
}

function Homepage() {
  const [openSheet, setOpenSheet] = React.useState(false);

  return (
    <div className="home-parent py-10 px-10">
      <div className="flex justify-between items-centre">
        <h1 className="TrackyFy text-4xl font-bold">
          <b className="text-white">Tracky</b>
          <b className="text-orange-600">.Fy</b>
        </h1>

        <Button
          onClick={() => setOpenSheet(true)}
          className="relative overflow-hidden group flex items-center transition-transform hover:scale-105 hover:shadow-lg !bg-orange-600"
        >
          {/* Gradient background that appears on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          {/* Content stays above the gradient */}
          <span className="relative z-10 flex items-center">
            Sign-in
            <ArrowRightToLine
              size={30}
              className="ml-2 transition-transform duration-300 group-hover:translate-x-2"
            />
          </span>
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <h1 className="text-5xl font bold text-center">
          <b className="text-white">Tracky</b>
          <b className="text-orange-600">.Fy</b>
        </h1>
        <p className="text-sm font-semibold text-gray-300 py-5">
          The Best Gym Management Solution all at one place
        </p>
        <Button
          onClick={() => {
            const plansDiv = document.getElementById("plans");
            plansDiv?.scrollIntoView({ behavior: "smooth" });
          }}
          variant="outline"
          className="relative overflow-hidden group transition-transform hover:scale-105 hover:shadow-lg"
        >
          {/* Gradient background */}
          <span
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          ></span>
          {/* Text content above the gradient */}
          <span className="relative z-10">Explore Now</span>
        </Button>

        <ArrowDown
          size={40}
          color="gray"
          className="animate-bounce cursor-pointer mt-25"
        />
      </div>

      <div id="plans">
        <h1 className="text-3xl font-bold text-center text-white mt-23">
          Our Plans
        </h1>
        <PlansList />
      </div>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="!w-[100vw] sm:!w-[450px] !max-w-[500px] overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center min-h-screen">
          <SheetHeader className="w-full">
            <SheetTitle></SheetTitle>
          </SheetHeader>

          <Suspense fallback={<div>Loading...</div>}>
            <AuthContent />
          </Suspense>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Homepage;
