import { useState, useRef, type ReactNode, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Variants } from "framer-motion";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  placement?: TooltipPlacement;
  delayMs?: number;
  children: ReactNode;
  className?: string;
}

const placementStyles: Record<TooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const motionOrigin: Record<TooltipPlacement, Variants> = {
  top: {
    hidden: { y: 4, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  bottom: {
    hidden: { y: -4, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  left: {
    hidden: { x: 4, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  right: {
    hidden: { x: -4, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
};

export function Tooltip({
  content,
  placement = "top",
  delayMs = 300,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let top: number;
        let left: number;

        switch (placement) {
          case "top":
            top = rect.top - 8;
            left = rect.left + rect.width / 2;
            break;
          case "bottom":
            top = rect.bottom + 8;
            left = rect.left + rect.width / 2;
            break;
          case "left":
            top = rect.top + rect.height / 2;
            left = rect.left - 8;
            break;
          case "right":
            top = rect.top + rect.height / 2;
            left = rect.right + 8;
            break;
        }

        setCoords({ top, left });
        setVisible(true);
      }
    }, delayMs);
  }, [delayMs, placement]);

  const hide = useCallback(() => {
    if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  const variants = motionOrigin[placement];

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-flex"
      >
        {children}
      </div>
      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              role="tooltip"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "fixed z-50 pointer-events-none",
                "px-2.5 py-1.5 text-xs font-medium rounded-md",
                "bg-[var(--surface-elevated)] text-[var(--text-primary)]",
                "border border-[var(--border-default)]",
                "shadow-lg whitespace-nowrap",
                placementStyles[placement],
                className,
              )}
              style={{ top: coords.top, left: coords.left }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
