import React, { useState } from "react";
import { MessageSquare, Send, X, CheckCircle2 } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";

export const FeedbackWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addNotification } = useUiStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitted(true);
    addNotification("Thank you for your feedback!", "success");

    setTimeout(() => {
      setIsSubmitted(false);
      setFeedback("");
      setIsOpen(false);
    }, 1800);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-amber-500 border border-zinc-200 dark:border-zinc-800 rounded transition-colors"
        title="Give Feedback"
        aria-label="Open feedback modal"
      >
        <MessageSquare className="w-4 h-4" />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 w-full max-w-sm text-left inline-block align-middle font-mono space-y-4 shadow-2xl animate-in fade-in zoom-in-95 mx-auto">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Send Feedback</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 p-1 rounded"
                aria-label="Close feedback modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto animate-bounce" />
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Feedback Sent!</p>
                <p className="text-xs text-zinc-500 font-sans">Thank you for helping us improve ALCHEMI.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    How was your experience?
                  </label>
                  <div className="flex items-center space-x-2 justify-between">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                          rating >= star
                            ? "bg-amber-500 text-black"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Comments or Suggestions
                  </label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what worked or what can be improved..."
                    required
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 font-sans"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 hover:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Submit</span>
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
