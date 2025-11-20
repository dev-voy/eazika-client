"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AnimatedSplashPage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 bg-white z-0"></div>
      <motion.div
        className="absolute inset-0 bg-[#ffe59a] z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.3 }}
      ></motion.div>

      <AnimatePresence>
        {!showContent && (
          <motion.div
            key="initial-logo"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <motion.img
              layoutId="splash-logo"
              src="/icon0.svg"
              alt="Eazika Logo"
              className="w-32 h-32"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {showContent && (
        <motion.div
          key="content-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-col h-full items-center justify-between text-center p-8"
        >
          <div />

          <div className="flex flex-col items-center">
            <div className="w-[300px] h-[225px] flex items-center justify-center">
              <motion.img
                layoutId="splash-logo"
                src="/icon0.svg"
                alt="Eazika Logo"
                className="w-24 h-24"
                transition={{ duration: 0.8, ease: "circOut" }}
              />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-2xl md:text-3xl font-bold text-gray-800 mt-8"
            >
              Fast and responsible delivery <br /> by our courier
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="mt-4 max-w-sm text-gray-500"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="w-full max-w-sm space-y-3"
          >
            <Link
              href="/register"
              className="block w-full bg-gray-800 text-white font-bold py-4 rounded-full text-center hover:bg-gray-900 transition-transform active:scale-95 shadow-lg"
            >
              CREATE AN ACCOUNT
            </Link>
            <Link
              href="/login"
              className="block w-full bg-white text-gray-800 font-bold py-4 rounded-full text-center hover:bg-gray-100 transition-transform active:scale-95 border-2 border-gray-300"
            >
              LOGIN
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

