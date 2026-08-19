import React, { useState } from "react";
import { createPortal } from "react-dom";
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
        className="p-2 bg-[#fff8f6] dark:bg-[#231917] hover:bg-[#f4a300] hover:text-[#231917] text-[#231917] dark:text-[#fdf8f0] border-2 border-[#231917] dark:border-[#f4a300] shadow-[2px_2px_0px_#231917] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
        title="Give Feedback"
        aria-label="Open feedback modal"
      >
        <MessageSquare className="w-4 h-4" />
      </button>

      {/* Feedback Modal */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-[#231917]/70 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-4">
          <div className="bg-[#fdf8f0] dark:bg-[#181211] border-2 border-[#231917] dark:border-[#f4a300] p-5 w-full max-w-sm text-left font-mono space-y-4 shadow-[6px_6px_0px_#231917] dark:shadow-[6px_6px_0px_#f4a300] relative">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#231917] dark:border-[#f4a300]">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-[#f4a300] border border-[#231917]">
                  <MessageSquare className="w-4 h-4 text-[#231917]" />
                </div>
                <span className="font-display text-base text-[#231917] dark:text-[#fdf8f0]">SEND FEEDBACK</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 bg-[#fff8f6] dark:bg-[#231917] border border-[#231917] text-[#231917] dark:text-[#fdf8f0] shadow-[1px_1px_0px_#231917]"
                aria-label="Close feedback modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#f4a300] mx-auto animate-bounce" />
                <p className="font-display text-lg text-[#231917] dark:text-[#fdf8f0]">FEEDBACK SENT!</p>
                <p className="text-xs text-[#5c4a45] dark:text-[#dcc0ba] font-sans font-medium">Thank you for helping us improve ALCHEMI.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#231917] dark:text-[#fdf8f0] mb-1.5">
                    How was your experience?
                  </label>
                  <div className="flex items-center space-x-1.5 justify-between">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`flex-1 py-1.5 text-xs font-black border-2 border-[#231917] dark:border-[#f4a300] transition-all cursor-pointer ${
                          rating >= star
                            ? "bg-[#f4a300] text-[#231917] shadow-[2px_2px_0px_#231917]"
                            : "bg-[#fff8f6] dark:bg-[#231917] text-[#88726c] shadow-[1px_1px_0px_#231917]"
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#231917] dark:text-[#fdf8f0] mb-1.5">
                    Comments or Suggestions
                  </label>
                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what worked or what can be improved..."
                    required
                    className="w-full p-2.5 bg-[#fff8f6] dark:bg-[#231917] border-2 border-[#231917] dark:border-[#f4a300] text-xs text-[#231917] dark:text-[#fdf8f0] placeholder-[#88726c] focus:outline-none shadow-[2px_2px_0px_#231917] font-sans"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 border-2 border-[#231917] dark:border-[#f4a300] text-xs font-bold text-[#231917] dark:text-[#fdf8f0] bg-[#fff8f6] dark:bg-[#231917] shadow-[2px_2px_0px_#231917] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#f4a300] text-[#231917] font-black border-2 border-[#231917] shadow-[2px_2px_0px_#231917] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SUBMIT</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
