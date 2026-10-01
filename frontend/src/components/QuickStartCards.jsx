import { Dumbbell, Flame, Home, Wind, CalendarDays, Apple } from "lucide-react";

const SUGGESTIONS = [
  { text: "Create a beginner workout plan", icon: Dumbbell },
  { text: "How do I build muscle?", icon: Flame },
  { text: "Give me a home workout", icon: Home },
  { text: "How can I improve my stamina?", icon: Wind },
  { text: "Suggest a weekly gym routine", icon: CalendarDays },
  { text: "What should I eat after a workout?", icon: Apple },
];

export default function QuickStartCards({ onSelect }) {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-2.5 px-4 sm:grid-cols-2 sm:px-6">
      {SUGGESTIONS.map(({ text, icon: Icon }) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          className="group flex items-center gap-3 rounded-2xl border border-charcoal-600 bg-charcoal-900/60 p-3.5 text-left text-sm text-neutral-300 transition-all hover:-translate-y-0.5 hover:border-lime-400/40 hover:bg-charcoal-800 hover:text-neutral-100"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-charcoal-800 text-lime-400 group-hover:bg-lime-400/10">
            <Icon className="h-4 w-4" strokeWidth={2} />
          </span>
          {text}
        </button>
      ))}
    </div>
  );
}
