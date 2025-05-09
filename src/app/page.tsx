"use client";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRightToLine, User, LogOut, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  SignUp,
  SignIn,
  useAuth,
  UserButton,
  useUser,
  SignOutButton,
} from "@clerk/nextjs";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PlansList from "./_components/plans-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Create a separate component for parts that use useSearchParams
function AuthContent({ onSignInComplete }: { onSignInComplete: () => void }) {
  const searchParams = useSearchParams();
  const form = searchParams.get("form");

  return (
    <div className="flex items-center justify-center w-full">
      {form === "sign-in" ? (
        <SignIn
          routing="hash"
          signUpUrl="/?form=sign-up"
          afterSignInUrl="/account"
          redirectUrl="/account"
        />
      ) : (
        <SignUp
          routing="hash"
          signInUrl="/?form=sign-in"
          afterSignUpUrl="/account"
          redirectUrl="/account"
        />
      )}
    </div>
  );
}

// User Profile Component
function UserProfile({ onClose }: { onClose: () => void }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const iconSize = 18;

  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 bg-transparent shadow-none">
      <CardHeader className="flex flex-col items-center space-y-4 pb-2">
        <Avatar
          className="h-40 w-40 border-2 border-orange-500 shadow-xl shadow-orange-900/20 ring-4 ring-orange-500/30 overflow-hidden"
          style={{ width: "160px", height: "160px" }} // Increased CSS display size to 160px
        >
          <AvatarImage
            src={user.imageUrl}
            alt={user.fullName || "User"}
            className="object-cover w-full h-full"
            width={320}
            height={320} // 2x resolution (320px) for better quality
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
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const form = searchParams.get("form");

  React.useEffect(() => {
    // If form parameter is present, open the sheet
    if (form === "sign-in" || form === "sign-up") {
      setOpenSheet(true);
    }
  }, [form]);

  const handleSignInComplete = () => {
    router.push("/account");
    setOpenSheet(false);
  };

  return (
    <div className="home-parent min-h-screen bg-gradient-to-b from-gray-900 to-black py-6 px-4 md:py-10 md:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 md:mb-16">
          <h1 className="TrackyFy text-3xl md:text-4xl font-bold flex items-center">
            <b className="text-white">Tracky</b>
            <b className="text-orange-600">.Fy</b>
          </h1>

          {isLoaded && (
            isSignedIn ? (
              <div className="flex items-center gap-2 md:gap-4">
                <Button
                  onClick={() => router.push("/account")}
                  variant="ghost"
                  className="text-white hover:text-orange-500 transition-colors text-sm md:text-base px-2 md:px-4"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => setOpenSheet(true)}
                  className="relative overflow-hidden group flex items-center transition-all hover:scale-105 text-sm md:text-base px-3 md:px-4 py-1 md:py-2"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-100 transition-opacity duration-300"></span>
                  <span className="relative z-10 flex items-center">
                    <User size={16} className="mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Profile</span>
                  </span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setOpenSheet(true)}
                data-sheet-trigger="true"
                className="relative overflow-hidden group flex items-center transition-transform hover:scale-105 hover:shadow-lg bg-orange-600 text-sm md:text-base px-3 md:px-4 py-1 md:py-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center">
                  Sign-in
                  <ArrowRightToLine
                    size={16}
                    className="ml-1 md:ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Button>
            )
          )}
        </header>

        <main>
          <section className="flex flex-col justify-center items-center min-h-[60vh] md:min-h-[70vh] text-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-400">
                <span className="text-white">Tracky</span>
                <span className="text-orange-600">.Fy</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl font-medium text-gray-300 mb-6 md:mb-10 max-w-xl mx-auto px-4">
                The Ultimate Gym Management Solution - All in One Place
              </p>
              <Button
                onClick={() => {
                  const plansDiv = document.getElementById("plans");
                  plansDiv?.scrollIntoView({ behavior: "smooth" });
                }}
                className="relative overflow-hidden group px-6 py-4 md:px-8 md:py-6 text-base md:text-lg font-medium bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all duration-300 rounded-full shadow-lg hover:shadow-orange-500/30"
              >
                <span className="relative z-10 flex items-center">
                  Explore Plans
                  <ArrowDown size={18} className="ml-2 animate-bounce" />
                </span>
              </Button>
            </div>
          </section>

          <section
            id="plans"
            className="py-12 md:py-20 scroll-mt-16 md:scroll-mt-23"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12 ">
              <span className="relative">
                Our Plans
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 md:w-20 h-1 bg-orange-500 rounded-full"></span>
              </span>
            </h2>
            <PlansList />
          </section>
        </main>
      </div>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent
          side="right"
          className="!w-full sm:!max-w-[450px] p-0 overflow-hidden flex flex-col bg-gradient-to-b from-gray-900 to-black border-l border-gray-800"
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <SheetHeader className="p-6 pb-0">
              <SheetTitle className="text-white text-center text-2xl font-bold">
                {isSignedIn ? "Your Profile" : "Welcome to TrackyFy"}
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 flex items-center justify-center p-4 md:p-6">
              {isLoaded &&
                (isSignedIn ? (
                  <UserProfile onClose={() => setOpenSheet(false)} />
                ) : (
                  <Suspense
                    fallback={
                      <div className="text-white flex items-center justify-center h-full w-full">
                        <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    }
                  >
                    <AuthContent onSignInComplete={handleSignInComplete} />
                  </Suspense>
                ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Homepage;
