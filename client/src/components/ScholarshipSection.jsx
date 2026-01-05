import {
  Star,
  StarHalf,
  Loader2,
  Info,
  Megaphone,
  Brain,
  Code,
  Landmark,
  MessageCircle,
} from "lucide-react";

const ScholarshipSection = () => {
  return (
    <section
      id="scholarship"
      className="bg-gradient-to-tl from-black via-slate-900 to-black py-20"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">

          <div className="header-text text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            🎓 Scholarship Slabs at{" "}
            <span className="text-yellow-400"> BM Academy</span>
          </h1>
        </div>
          <p className="text-gray-300 mt-0 text-lg">
            Unlock your scholarship based on your SAT performance.
          </p>
        </div>

        {/* Table */}
        <div
          className="w-full max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <table className="w-full text-left text-sm border-collapse rounded-xl overflow-hidden shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-3 px-4 font-semibold">Your SAT Score</th>
                <th className="py-3 px-4 font-semibold">Scholarship Discount</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center gap-2">
                  <Star className="text-yellow-500 w-4 h-4" />
                  85% and above
                </td>
                <td className="py-3 px-4 font-semibold text-green-600">
                  80% OFF
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center gap-2">
                  <StarHalf className="text-yellow-400 w-4 h-4" />
                  70% – 84%
                </td>
                <td className="py-3 px-4 font-semibold text-green-600">
                  50% OFF
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center gap-2">
                  <Loader2 className="text-yellow-300 w-4 h-4" />
                  50% – 69%
                </td>
                <td className="py-3 px-4 font-semibold text-yellow-600">
                  25% OFF
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center gap-2">
                  <Info className="text-gray-400 w-4 h-4" />
                  Below 50%
                </td>
                <td className="py-3 px-4 font-semibold text-gray-600">
                  Guaranteed Base Discount
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Programs */}
        <div className="mt-12 text-center" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-3xl font-bold text-gray-100 mb-6">
            APPLY YOUR  <span className="text-yellow-500">SCHOLARSHIP</span>
            <br />
            TO TOP-RATED PROGRAMS
          </h3>

          <div className="flex flex-wrap justify-center gap-5">
            {[
              { icon: <Megaphone className="text-blue-500" />, label: "Digital Marketing" },
              { icon: <Brain className="text-purple-500" />, label: "Python & Data Science" },
              { icon: <Code className="text-green-500" />, label: "Web & Full Stack Dev" },
              { icon: <Landmark className="text-yellow-500" />, label: "Bank Exam Coaching" },
              { icon: <MessageCircle className="text-pink-500" />, label: "Communication & Soft Skills" },
            ].map(({ icon, label }, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 flex items-center gap-3 shadow-lg transition-transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
              >
                {icon}
                <span className="text-base font-semibold text-gray-100">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScholarshipSection;
