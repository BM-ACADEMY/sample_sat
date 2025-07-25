const courses = [
  {
    title: "AI for School Students",
    audience: "8th–12th std students",
    original: "₹1,499",
    offer: "₹749",
    mode: "Online/Offline",
  },
  {
    title: "AI for College Students",
    audience: "Final year students & tech learners",
    original: "₹1,999",
    offer: "₹999",
    mode: "Online/Offline",
  },
  {
    title: "AI for Job Seekers",
    audience: "Freshers, job hunters",
    original: "₹1,999",
    offer: "₹999",
    mode: "Online/Offline",
  },
  {
    title: "AI for Entrepreneurs",
    audience: "Startup founders, solo biz owners",
    original: "₹2,499",
    offer: "₹1,299",
    mode: "Online/Offline",
  },
  {
    title: "AI for Digital Marketers",
    audience: "Marketers, freelancers, media teams",
    original: "₹2,499",
    offer: "₹1,299",
    mode: "Online/Offline",
  },
];

const AICourseTable = () => {
  return (
    <section className="bg-gradient-to-tr from-black via-slate-900 to-black py-12">
      <div className="container mx-auto px-6">
        <div className="header-text text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            AI Course Series –{" "}
            <span className="text-yellow-400">Pay & Join Instantly</span>
          </h1>
        </div>

        <div className="overflow-x-auto bg-white/10 rounded-lg shadow-xl p-6 backdrop-blur">
          <table className="min-w-full course-table text-sm text-gray-800">
            <thead>
              <tr className="bg-indigo-600 text-white uppercase text-sm leading-normal">
                <th className="py-4 px-6 text-left">Course</th>
                <th className="py-4 px-6 text-left">Who it's for</th>
                <th className="py-4 px-6 text-left">Original</th>
                <th className="py-4 px-6 text-left">Offer</th>
                <th className="py-4 px-6 text-left">Mode</th>
                <th className="py-4 px-6 text-center">Brochure</th>
                <th className="py-4 px-6 text-center">Pay</th>
                <th className="py-4 px-6 text-center">Syllabus</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 font-medium">
              {courses.map((course, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-200 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="py-4 px-6 font-semibold text-indigo-600">
                    {course.title}
                  </td>
                  <td className="py-4 px-6">{course.audience}</td>
                  <td className="py-4 px-6 text-red-500 line-through">
                    {course.original}
                  </td>
                  <td className="py-4 px-6 text-green-500 font-bold">
                    {course.offer}
                  </td>
                  <td className="py-4 px-6">{course.mode}</td>
                  <td className="py-4 px-6 text-center">
                    <a
                      href="#"
                      className="action-link text-blue-500 hover:text-blue-700"
                    >
                      📥 Download
                    </a>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <a
                      href="#"
                      className="action-link text-green-500 hover:text-green-700"
                    >
                      💳 Pay
                    </a>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <a
                      href="#"
                      className="action-link text-blue-500 hover:text-blue-700"
                    >
                      📄 View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AICourseTable;
