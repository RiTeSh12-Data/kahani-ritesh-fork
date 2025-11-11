import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface SectionFiveFAQsProps {
  faqs?: FAQItem[];
}

const defaultFAQs: FAQItem[] = [
  {
    question: "What is Kahani?",
    answer: "A simple way to save your loved ones' voices and stories — forever."
  },
  {
    question: "How does it work?",
    answer: "We send story questions on WhatsApp. They reply with voice notes. We turn those into a beautiful memory book."
  },
  {
    question: "Who is it for?",
    answer: "Anyone who wants to keep their parents', grandparents', or loved ones' stories alive."
  },
  {
    question: "Is it private?",
    answer: "Completely. Your chats and voice notes stay encrypted and safe — always."
  },
  {
    question: "Can I redo or delete a story?",
    answer: "Yes. You can re-record or ask us to remove any message before your book is made."
  },
  {
    question: "What do I get in the end?",
    answer: "A keepsake book with their stories, photos, and QR codes to hear their voices."
  },
  {
    question: "Do I need an app?",
    answer: "No app, no login. Everything happens on WhatsApp."
  },
  {
    question: "Can they speak in Hindi or another language?",
    answer: "Yes. Any Indian language works — the book keeps their voice just as it is."
  },
  {
    question: "How long does it take?",
    answer: "Usually 2–4 weeks after the stories are sent."
  },
  {
    question: "Can I gift this?",
    answer: "Absolutely. You can gift a Kahani to anyone you love — one link starts their journey."
  }
];

export default function SectionFiveFAQs({
  faqs = defaultFAQs
}: SectionFiveFAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Closure Text */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1B2632] text-center leading-tight font-['Outfit']">
          Keep stories alive, because stories are what make us.
        </h2>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#EEE9DF]/50 rounded-2xl overflow-hidden shadow-sm"
              data-testid={`faq-${index + 1}`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover-elevate active-elevate-2"
                aria-expanded={openIndex === index}
                data-testid={`faq-question-${index + 1}`}
              >
                <span className="text-base sm:text-lg font-semibold text-[#1B2632] pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`flex-shrink-0 w-5 h-5 text-[#A35139] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer Body */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {openIndex === index && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                    <p
                      className="text-[#1B2632]/70 leading-relaxed text-sm sm:text-base"
                      data-testid={`faq-answer-${index + 1}`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
