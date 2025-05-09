"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowDown, 
  ArrowRightToLine, 
  LogOut, 
  ChevronRight,
  Zap,
  LucideIcon
} from "lucide-react";
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
import { SignUp, SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PlansList from "./_components/plans-list";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

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

// Logo component for reusability
function Logo({ className = "" }) {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    fetch('/favicon.svg')
      .then(response => response.text())
      .then(data => {
        setSvgContent(data);
      })
      .catch(error => console.error('Error loading SVG:', error));
  }, []);

  return (
    <div className={`logo-container ${className}`} dangerouslySetInnerHTML={{ __html: svgContent || '' }} />
  );
}

// Define the props interface for FeatureCard
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Hero Feature Card Component
function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-0 bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700 shadow-xl transition-transform hover:scale-105 hover:shadow-orange-900/20">
      <CardHeader className="pb-2">
        <div className="mb-2 p-2 w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-white text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}

// User Profile Component for the Sheet
function UserProfileSheet({ onClose }: { onClose: () => void }) {
  const { user } = useUser();
  const router = useRouter();
  const iconSize = 18;

  if (!user) return null;

  return (
    <Card className="w-full max-w-md mx-auto border-0 bg-transparent shadow-none">
      <CardHeader className="flex flex-col items-center space-y-4 pb-2">
        <Avatar
          className="h-24 w-24 sm:h-40 sm:w-40 border-2 border-orange-500 shadow-xl shadow-orange-900/20 ring-4 ring-orange-500/30 overflow-hidden"
          style={{ width: "160px", height: "160px" }}
        >
          <AvatarImage
            src={user.imageUrl}
            alt={user.fullName || "User"}
            className="object-cover w-full h-full"
            width={320}
            height={320}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <AvatarFallback className="text-4xl bg-gradient-to-r from-orange-500 to-pink-500 text-white">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{user.fullName}</h2>
          <p className="text-gray-400">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-0 py-6">
        <Card className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Account Options</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your TrackyFy account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all"
              onClick={() => {
                router.push("/account");
                onClose();
              }}
            >
              Go to Dashboard
              <ArrowRightToLine className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => {
                router.push("/account/user/purchase-plan");
                onClose();
              }}
            >
              View Plans
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-gray-700 pt-4">
            <div className="flex items-center justify-center w-full">
              <SignOutButton redirectUrl="/">
                <Button className="w-full relative overflow-hidden group flex items-center justify-center bg-black text-white border border-gray-800 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,50,50,0.5)]">
                  <span className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center">
                    Logout
                    <LogOut
                      size={iconSize}
                      className="ml-2 transition-all duration-300 group-hover:text-red-400"
                    />
                  </span>
                </Button>
              </SignOutButton>
            </div>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
}

function Homepage() {
  const [openSheet, setOpenSheet] = React.useState(false);
  const iconSize = 18;
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="py-4 sm:py-6 px-4 sm:px-6 md:px-10 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center">
          <Logo className="w-8 h-8 sm:w-10 sm:h-10 mr-2" />
          <span>
            <b className="text-white">Tracky</b>
            <b className="text-orange-600">.Fy</b>
          </span>
        </h1>

        <div className="flex gap-2 sm:gap-4">
          {isLoaded && isSignedIn ? (
            <div className="flex gap-2 sm:gap-4">
              <Button
                className="hidden sm:flex bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all text-white px-3 sm:px-6 py-2 text-sm sm:text-base"
                onClick={() => router.push("/account")}
              >
                Dashboard
                <ArrowRightToLine size={iconSize} className="ml-1 sm:ml-2" />
              </Button>
              
              <Button
                onClick={() => setOpenSheet(true)}
                className="relative overflow-hidden group flex items-center bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 transition-all text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center">
                  Profile
                  <ChevronRight
                    size={iconSize}
                    className="ml-1 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setOpenSheet(true)}
              className="relative overflow-hidden group flex items-center bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center">
                Sign In
                <ArrowRightToLine
                  size={iconSize}
                  className="ml-1 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center">
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-gray-800 text-orange-400 text-xs sm:text-sm font-medium">
              Gym Management Solution
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-white">Manage Your Gym With </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">Tracky.Fy</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-300 max-w-xl">
              The ultimate all-in-one gym management platform. Track members, manage payments, and grow your fitness business.
            </p>
            
            <div className="flex flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
              {isLoaded && isSignedIn ? (
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all text-white px-3 sm:px-8 py-2 sm:py-6 text-sm sm:text-base"
                  onClick={() => router.push("/account")}
                >
                  Go to Dashboard
                  <ArrowRightToLine size={iconSize} className="ml-1 sm:ml-2" />
                </Button>
              ) : (
                <Button 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all text-white px-3 sm:px-8 py-2 sm:py-6 text-sm sm:text-base"
                  onClick={() => setOpenSheet(true)}
                >
                  Get Started
                  <ChevronRight size={iconSize} className="ml-1 sm:ml-2" />
                </Button>
              )}
              
              <Button 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-3 sm:px-8 py-2 sm:py-6 text-sm sm:text-base"
                onClick={() => {
                  const plansDiv = document.getElementById("plans");
                  plansDiv?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Plans
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-md mx-auto md:max-w-none">
            <div className="w-full h-64 sm:h-80 md:h-96 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-1">
              <div className="w-full h-full rounded-lg bg-gradient-to-r from-orange-500/10 to-pink-500/10 overflow-hidden relative">
                {/* This would typically be an image of your product/dashboard */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Logo className="w-32 h-32 sm:w-40 sm:h-40" />
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-3xl opacity-20" />
            <div className="absolute -top-4 -left-4 w-20 sm:w-32 h-20 sm:h-32 bg-orange-500 rounded-full blur-3xl opacity-10" />
          </div>
        </div>
        
        {/* Scroll down indicator */}
        <div className="flex justify-center mt-10 sm:mt-16 md:mt-20">
          <Button
            variant="ghost" 
            className="animate-bounce rounded-full p-2 bg-gray-800/50"
            onClick={() => {
              const featuresDiv = document.getElementById("features");
              featuresDiv?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ArrowDown size={20} className="text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Why Choose Tracky.Fy?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Our comprehensive gym management solution provides everything you need to run your fitness business efficiently.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <FeatureCard 
            icon={Zap} 
            title="Streamlined Management" 
            description="Handle member registrations, attendance tracking, and payment processing all in one place."
          />
          <FeatureCard 
            icon={Zap} 
            title="Financial Insights" 
            description="Get detailed reports on revenue, membership trends, and business performance."
          />
          <FeatureCard 
            icon={Zap} 
            title="Member Engagement" 
            description="Send automated notifications, track fitness progress, and improve retention."
          />
        </div>
      </div>

      {/* Plans Section */}
      <div id="plans" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-block px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-gray-800 text-orange-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Pricing Options
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Choose Your Plan</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Select the perfect plan for your gym's size and needs. Scale up as your business grows.
          </p>
        </div>
        
        <PlansList />
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-10 px-4 sm:px-6 md:px-10 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Logo className="w-8 h-8 mr-2" />
            <h3 className="text-xl sm:text-2xl font-bold">
              <b className="text-white">Tracky</b>
              <b className="text-orange-600">.Fy</b>
            </h3>
          </div>
          
          <p className="text-gray-400 text-center md:text-right text-sm sm:text-base">
            © {new Date().getFullYear()} Tracky.Fy. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Auth Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="!w-full sm:!w-[450px] !max-w-[500px] overflow-y-auto overflow-x-hidden flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 border-l border-gray-800">
          <SheetHeader className="w-full mb-6">
            <SheetTitle className="text-center flex items-center justify-center text-xl sm:text-2xl font-bold">
              <Logo className="w-8 h-8 mr-2" />
              <span>
                <span className="text-white">Tracky</span>
                <span className="text-orange-600">.Fy</span>
              </span>
            </SheetTitle>
          </SheetHeader>

          {isLoaded && isSignedIn ? (
            <UserProfileSheet onClose={() => setOpenSheet(false)} />
          ) : (
            <Card className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700 shadow-xl">
              <CardContent className="pt-6">
                <Suspense fallback={
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                }>
                  <AuthContent />
                </Suspense>
              </CardContent>
            </Card>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Homepage;
