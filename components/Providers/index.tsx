"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
// import { SocketProvider } from "@/contexts/SocketContext";
import PushNotificationProvider from "./pushNotification";

const Providers = ({ children }: { children: React.ReactNode }) => {
  // React.useEffect(() => {});
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
