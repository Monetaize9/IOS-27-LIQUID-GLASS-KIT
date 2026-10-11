"use client";

import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useIsClient } from "./hooks";

export function Portal({ children }: { children: ReactNode }) {
  const client = useIsClient();
  return client ? createPortal(children, document.body) : null;
}
