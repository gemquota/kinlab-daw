import { createHashRouter, type RouteObject } from "react-router-dom";
import { AppShell } from "./AppShell";

import { Waveform } from "@/pages/Waveform";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Waveform /> },
      { path: "waveform", element: <Waveform /> },
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
