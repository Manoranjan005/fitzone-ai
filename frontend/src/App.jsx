import { useState } from "react";
import Header from "./components/Header.jsx";
import QuickStartCards from "./components/QuickStartCards.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import ChatInput from "./components/ChatInput.jsx";

const API_URL = "/api/chat";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text) => {
    const userMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          // Send prior turns only (backend appends the new user message).
          history: messages,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't reach the coaching service just now. Please check your connection and try again in a moment.",
        },
      ]);
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header onNewChat={handleNewChat} hasMessages={hasMessages} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-0">
        {!hasMessages ? (
          <div className="flex flex-1 flex-col justify-center gap-6 pb-10">
            <QuickStartCards onSelect={sendMessage} />
          </div>
        ) : (
          <ChatWindow messages={messages} isTyping={isTyping} />
        )}

        <div className="sticky bottom-0 w-full bg-gradient-to-t from-charcoal-950 via-charcoal-950 px-4 pb-6 pt-3 sm:px-6">
          <ChatInput onSend={sendMessage} disabled={isTyping} />
          <p className="mt-2.5 text-center text-xs text-neutral-500">
            FitZone AI is an AI fitness assistant, not a doctor or certified personal trainer.
          </p>
        </div>
      </main>
    </div>
  );
}
