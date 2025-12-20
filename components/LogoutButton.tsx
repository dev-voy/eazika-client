"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { userStore } from "@/store";
import { cn } from "@/lib/utils";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function LogoutButton({
  className,
  redirect,
}: {
  className?: string;
  redirect?: string;
}) {
  const { logout } = userStore();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push(redirect ? redirect : "/login");
  };
  return (
    <>
      {/* Logout Button */}
      <motion.div variants={itemVariants}>
        <button
          onClick={() => setShowLogoutModal(true)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer",
            className
          )}
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="font-semibold text-red-500">Log Out</span>
        </button>
      </motion.div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl p-6 text-center border border-gray-100 dark:border-gray-700"
            >
              <div className="mx-auto h-12 w-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Log Out?
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-colors text-sm"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
