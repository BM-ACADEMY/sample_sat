import React from "react";
import { MessageSquareQuote } from "lucide-react";

const cardsData = [
  {
    name: "Priya",
    handle: "College Student",
    text: "I scored 78% on the SAT and received 50% off my Digital Marketing course at BM Academy. It was so easy!",
  },
  {
    name: "Sundar",
    handle: "MBA Graduate",
    text: "As a working professional, I loved how simple and quick the SAT was. I got 25% off the Power BI course!",
  },
  {
    name: "Aarav",
    handle: "12th Std Student",
    text: "The SAT was stress-free and fun. I got a 40% scholarship for the Web Development program. Thank you BM Academy!",
  },
  {
    name: "Meera",
    handle: "Job Seeker",
    text: "After scoring 85% in the SAT, I joined the UI/UX Design course with a 60% scholarship. It really helped me switch careers.",
  },
  {
    name: "Rahul",
    handle: "B.Com Graduate",
    text: "BM Academy’s SAT test was a great opportunity. I earned 30% off on my Data Analytics course — highly recommend it!",
  },
];

const Testimonials = () => {
  const repeatedCards = [...cardsData, ...cardsData]; // for marquee looping

  return (
    <section id="testimonials" className="bg-gradient-to-tr from-black via-slate-900 to-black py-20 text-white">
      

      <div className="header-text text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Student Testimonials{" "}
            <span className="text-yellow-400">& Results</span>
          </h1>
                  <p className="text-gray-300 text-lg">Hear from our successful SAT participants</p>
        </div>

      {/* Style for marquee animation */}
      <style>
        {`
        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          animation: marqueeScroll 28s linear infinite;
        }
        .marquee-reverse {
          animation-direction: reverse;
        }
      `}
      </style>

      {/* Row 1 */}
      <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#0c1221] to-transparent"></div>
        <div className="marquee-inner flex min-w-[200%] gap-6 pb-6 pt-10">
          {repeatedCards.map((card, idx) => (
            <TestimonialCard key={`r1-${idx}`} {...card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-[#0c1221] to-transparent"></div>
      </div>

      {/* Row 2 */}
      <div className="marquee-row w-full mx-auto max-w-6xl overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-[#0c1221] to-transparent"></div>
        <div className="marquee-inner marquee-reverse flex min-w-[200%] gap-6 pt-6 pb-10">
          {repeatedCards.map((card, idx) => (
            <TestimonialCard key={`r2-${idx}`} {...card} />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-[#0c1221] to-transparent"></div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ name, handle, text }) => (
  <div className="bg-white p-4 rounded-xl w-72 shadow hover:shadow-lg transition duration-300 shrink-0">
    <div className="mb-3">
      <h4 className="font-semibold text-gray-800">{name}</h4>
      <p className="text-xs text-gray-500">{handle}</p>
    </div>
    <p className="text-gray-700 text-sm mb-2">
      <MessageSquareQuote className="inline-block text-blue-400 mr-1" size={16} />
      {text}
    </p>
  </div>
);

export default Testimonials;
