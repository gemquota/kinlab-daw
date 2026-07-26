import { useState } from "react";
import { create } from "zustand";
import { X, ChevronRight, ChevronLeft, Waves, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── help store ── */
interface HelpStore {
  isOpen: boolean;
  step: number;
  openHelp: () => void;
  close: () => void;
  setStep: (n: number) => void;
  next: () => void;
  prev: () => void;
}

export const useHelpStore = create<HelpStore>()((set) => ({
  isOpen: false,
  step: 0,
  openHelp: () => set({ isOpen: true, step: 0 }),
  close: () => set({ isOpen: false }),
  setStep: (n) => set({ step: n }),
  next: () => set((s) => ({ step: s.step + 1 })),
  prev: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
}));

/* ── tour steps ── */
interface TourStep {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
  detail: string;
  action?: { label: string; path: string };
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to KinLab",
    icon: Sparkles,
    color: "text-derivative-position-500",
    description:
      "KinLab is a scientific visualization platform for exploring kinematics — the mathematics of motion — through interactive waveforms and real-time simulation.",
    detail:
      "The Harmonic Waveform Simulator lets you compose multiple sine-wave harmonics, adjust damping, resonance, and modulation, and watch derivatives (velocity, acceleration, jerk, snap) update in real time.",
  },
  {
    title: "The Harmonic Waveform Simulator",
    icon: Waves,
    color: "text-derivative-velocity-500",
    description:
      "This is the core of KinLab — a real-time waveform editor with harmonic composition, resonance analysis, and derivative visualization.",
    detail:
      "Add or remove harmonic components, adjust frequencies and phases, tweak damping and time stretch, and watch the waveform animate. The live panel shows resonance Q-factor and peak amplitude. Use the controls on the right to fine-tune your signal.",
    action: { label: "Open Waveform", path: "/waveform" },
  },
];

export function HelpModal() {
  const { isOpen, step, close, next, prev } = useHelpStore();
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const current = TOUR_STEPS[step]!;
  const isLast = step >= TOUR_STEPS.length - 1;
  const Icon = current.icon;

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      close();
    }, 150);
  }

  function handleNext() {
    if (isLast) {
      handleClose();
    } else {
      next();
    }
  }

  function handleAction() {
    if (current.action) {
      navigate(current.action.path);
      handleClose();
    }
  }

  return (
    <div
      className={`fixed inset-0 z-notification flex items-center justify-center bg-surface-overlay/50 transition-opacity ${isClosing ? "opacity-0" : "opacity-100"}`}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-surface-elevated rounded-xl border border-border-subtle shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-surface-tertiary ${current.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-text-primary">{current.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded text-text-tertiary hover:text-text-primary"
            aria-label="Close help"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-4 space-y-3">
          <p className="text-sm text-text-secondary leading-relaxed">{current.description}</p>
          <p className="text-xs text-text-tertiary leading-relaxed">{current.detail}</p>

          {current.action && (
            <button
              onClick={handleAction}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-derivative-position-500 text-white text-sm font-medium hover:bg-derivative-position-600 transition-colors"
            >
              {current.action.label}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border-subtle">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === step ? "bg-derivative-position-500" : "bg-surface-tertiary"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={prev}
                className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary"
              aria-label={isLast ? "Finish" : "Next step"}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
