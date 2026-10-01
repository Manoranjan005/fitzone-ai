import { Dumbbell, RotateCcw } from "lucide-react";

export default function Header({ onNewChat, hasMessages }) {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 shadow-glow">
            <Dumbbell className="h-5 w-5 text-charcoal-950" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-neutral-50">
            FitZone <span className="text-lime-400">AI</span>
          </span>
        </div>

        {hasMessages && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 rounded-full border border-charcoal-600 px-3.5 py-1.5 text-sm text-neutral-300 transition-colors hover:border-lime-400/50 hover:text-lime-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            New chat
          </button>
        )}
      </div>

      {!hasMessages && (
        <div className="mx-auto max-w-2xl px-4 pb-8 pt-10 text-center sm:px-6">
          <h1 className="font-display text-3xl font-semibold leading-tight text-neutral-50 sm:text-4xl">
            Your Personal AI Fitness Coach
          </h1>
          <p className="mt-3 text-base text-neutral-400">
            Train smarter. Get stronger. Stay consistent.
          </p>
        </div>
      )}
    </header>
  );
}
