"use client";


import useLoadingStore from "@/app/store/LoadingStore";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export function LoadingOverlay() {
  const { loading, message, action } = useLoadingStore();

  // Prevent scrolling when loading overlay is active
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-card shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />

        <div className="text-center space-y-2">
          <p className="text-lg font-medium">{action}</p>
          <p className="text-sm text-muted-foreground">
            {message}
            <LoadingDots />
          </p> 
        </div>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex ml-1">
      <span className="animate-loading-dot">.</span>
      <span className="animate-loading-dot animation-delay-200">.</span>
      <span className="animate-loading-dot animation-delay-400">.</span>
    </span>
  );
}
