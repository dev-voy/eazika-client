import { Header } from "@/app/components/Header";
import { BottomNav } from "@/app/components/BottomNav";
// REMOVED: import Providers ... (It is now in RootLayout)

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Removed <Providers> wrapper to avoid conflict with RootLayout
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-20 md:pb-0">
      <Header />
      <main className="w-full">{children}</main>
      <BottomNav />
    </div>
  );
}