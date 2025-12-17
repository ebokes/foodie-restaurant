"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Icon from "../ui/app-icon";
import { Button } from "../ui/button";
import { restaurants, menuCategories, specialDeals } from "@/lib/constants";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "👋 Hi there! I'm the Foodies assistant. Ask me about our locations, opening hours, or special deals!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Hours logic
    if (
      lowerQuery.includes("hour") ||
      lowerQuery.includes("open") ||
      lowerQuery.includes("close")
    ) {
      const downtown = restaurants.find((r) => r.id === "downtown");
      return `We are open! For example, Foodies Downtown is open ${downtown?.hours}. Would you like hours for a specific location?`;
    }

    // Location logic
    if (
      lowerQuery.includes("location") ||
      lowerQuery.includes("address") ||
      lowerQuery.includes("where")
    ) {
      const locs = restaurants.map((r) => r.name).join(", ");
      return `We have locations at: ${locs}. Which one are you closest to?`;
    }

    // Menu logic
    if (
      lowerQuery.includes("menu") ||
      lowerQuery.includes("food") ||
      lowerQuery.includes("eat")
    ) {
      const cats = menuCategories.map((c) => c.name).join(", ");
      return `Our menu features delicious categories like: ${cats}. Check out our Menu Catalog for more!`;
    }

    // Deals logic
    if (
      lowerQuery.includes("deal") ||
      lowerQuery.includes("special") ||
      lowerQuery.includes("offer")
    ) {
      const deal = specialDeals[0];
      return `Don't miss our ${deal.title}: ${deal.subtitle}! ${deal.description}. Valid until ${deal.validUntil}.`;
    }

    // Contact/Support logic
    if (
      lowerQuery.includes("contact") ||
      lowerQuery.includes("support") ||
      lowerQuery.includes("help") ||
      lowerQuery.includes("phone")
    ) {
      return "You can reach our support team at (555) 123-4567 or email support@foodies.com.";
    }

    // Greeting
    if (
      lowerQuery.includes("hi") ||
      lowerQuery.includes("hello") ||
      lowerQuery.includes("hey")
    ) {
      return "Hello! Hungry? 🍔 I can help you find food or a table.";
    }

    return "I'm not sure about that. I can tell you about our hours, locations, menu, and special deals!";
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = generateResponse(userMsg.text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-14 p-0 flex items-center justify-center bg-linear-to-br from-primary-solid via-grad1 to-grad2"
            >
              <Icon name="MessageCircleQuestion" size={28} />
              <span className="sr-only">Chat Support</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-[380px] h-[500px] max-h-[80vh] bg-card rounded-2xl shadow-warm-xl border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between text-primary-foreground bg-linear-to-br from-primary-solid to-grad2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Bot" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm">
                    Foodies Support
                  </h3>
                  <p className="text-xs font-body opacity-90">
                    Always here to help
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <Icon name="X" size={20} className="text-white" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm font-body shadow-sm ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-card border border-border text-foreground rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-muted/50 border border-border rounded-full px-4 py-2 text-sm font-body focus:outline-hidden focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="rounded-full h-10 w-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!inputValue.trim()}
                >
                  <Icon name="Send" size={18} />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
