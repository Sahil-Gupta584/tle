"use client";
import { addToast } from "@heroui/react";

import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorHandler(error: any) {
  if (!error) return;

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message ||
        error.response.data?.comment ||
        error.response.data?.error ||
        "Something went wrong with the server.";

      addToast({
        color: "danger",
        title: `Error ${status}`,
        description: message,
      });
    } else if (error.request) {
      // No response was received
      addToast({
        color: "danger",
        title: "Network Error",
        description:
          "No response received from server. Please try again later.",
      });
    } else {
      // Error setting up the request
      addToast({
        color: "danger",
        title: "Request Error",
        description: error.message,
      });
    }
    return null;
  }

  // ✅ Custom Server Error (BAD_REQUEST from your API)
  if (error?.data?.code === "BAD_REQUEST") {
    const data = JSON.parse(error);
    addToast({
      color: "danger",
      title: "Input Error",
      description: `${data[0]?.message}`,
    });
    return null;
  }

  // ✅ Zod validation error
  if (error?.name === "ZodError") {
    addToast({
      color: "danger",
      description: `${error?.issues[0]?.message} (${error?.issues[0]?.path[0]})`,
    });
    return null;
  }

  // ✅ Fallback
  console.log({ error });
  addToast({
    color: "danger",
    description: `${error.message || error.toString()}`,
  });
}

export const getRatingColor = (rating: number) => {
  if (rating >= 2100) return "text-red-600 dark:text-red-400 font-bold";
  if (rating >= 1900)
    return "text-orange-600 dark:text-orange-400 font-semibold";
  if (rating >= 1600)
    return "text-purple-600 dark:text-purple-400 font-semibold";
  if (rating >= 1400) return "text-blue-600 dark:text-blue-400 font-medium";
  if (rating >= 1200) return "text-green-600 dark:text-green-400 font-medium";
  return "text-gray-600 dark:text-gray-400";
};

export const CF_API_BASE_URL = "https://codeforces.com/api";
