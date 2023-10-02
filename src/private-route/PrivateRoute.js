import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { cookieExists } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!cookieExists) {
      router.push("/login");
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
      return;
    }
  }, [router, cookieExists]);

  return <>{isAuthorized && children}</>;
}
