"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
// import { SocketProvider } from "@/contexts/SocketContext";
import PushNotificationProvider from "./pushNotification";
import { userStore } from "@/store";
import { getToken } from "@/lib/axios";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { user, fetchUser } = userStore();
  React.useEffect(() => {
    (async () => {
      const token = await getToken("accessToken");
      if (!user && token) await fetchUser();
    })();
  }, [fetchUser, user]);
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* <SocketProvider> */}
        <PushNotificationProvider>

          {children}
          <Toaster richColors />
        </PushNotificationProvider>
        {/* </SocketProvider> */}
      </ThemeProvider>
    </>
  );
};

export default Providers;
