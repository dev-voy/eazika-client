import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AuthLayoutContent from "./AuthLayoutContent";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fffdf5] dark:bg-gray-950">
          <Loader2 className="animate-spin text-yellow-500" size={32} />
        </div>
      }
    >
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </Suspense>
  );
}