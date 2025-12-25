import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="animate-spin text-yellow-500" size={32} />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
