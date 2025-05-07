import { getCurrentUserFromSupabase } from "@/actions/users";
import React, { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "./header";
import { IUser } from "@/interfaces";
import Spinner from "@/components/ui/spinner";
import userGlobalStore, { IUsersGlobalStore } from "@/global-store/users-store";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const {user, setUser} = userGlobalStore() as IUsersGlobalStore;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const featchUser = async () => {
    try {
      setLoading(true);
      const responce: any = await getCurrentUserFromSupabase();
      if (!responce.success) {
        throw new Error(responce.error);
      } else {
        setUser(responce.data);
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching user data.");
      toast.error("An error occurred while featching user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    featchUser();
  }, []);

  if (loading) {
    return <Spinner parentHeight={"100vh"} />;
  }
  if (!loading && error) {
    return <div className="p-5">{error}</div>;
  }
  return (
    <div>
      <Header user={user} />
      <div className="p-5">{children}</div>
    </div>
  );
}

export default PrivateLayout;
