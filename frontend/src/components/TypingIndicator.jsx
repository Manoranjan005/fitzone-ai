import { Dumbbell } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex w-full gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-400 text-charcoal-950">
        <Dumbbell className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-charcoal-600 bg-charcoal-900/80 px-4 py-3.5">
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-lime-400 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-lime-400 [animation-delay:160ms]" />
        <span className="h-1.5 w-1.5 animate-blink rounded-full bg-lime-400 [animation-delay:320ms]" />
      </div>
    </div>
  );
}
