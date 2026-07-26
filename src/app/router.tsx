import { lazy, Suspense } from "react";
import { createHashRouter, type RouteObject } from "react-router-dom";
import { AppShell } from "./AppShell";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

// Task 2.1.1: Lazy load Waveform page
const Waveform = lazy(() => import("@/pages/Waveform").then(m => ({ default: m.Waveform })));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          // Task 2.1.2: Suspense wrapper with loading fallback
          <Suspense fallback={<LoadingSpinner />}>
            <Waveform />
          </Suspense>
        ),
      },
      {
        path: "waveform",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Waveform />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-text-primary mb-2">404</h1>
              <p className="text-sm text-text-secondary">Page not found</p>
            </div>
          </div>
        ),
      },
    ],
  },
];

export const router = createHashRouter(routes);
