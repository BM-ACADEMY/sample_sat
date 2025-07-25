import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Check,
  School,
  GraduationCap,
  Sparkle,
} from "lucide-react";
import About from '../assets/img/test.jpg'

const AboutSection = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section id="about" className="bg-gradient-to-tl from-black via-slate-900 to-black py-20">
      <div className="mx-auto px-6 md:px-16 lg:px-24 xl:px-32 flex flex-col-reverse md:flex-row items-center md:justify-between gap-12 pb-16 min-h-[600px]">

        {/* Left Content */}
        <div className="w-full md:w-1/2 text-left" data-aos="fade-right" data-aos-delay="100">
          <p className="flex items-center gap-1 text-gray-100 text-xs mb-2" data-aos="fade-up" data-aos-delay="150">
            <Sparkle size={16} className="text-gray-300" />
            About Us
          </p>

          <h1
            className="font-extrabold text-4xl md:text-6xl text-gray-200 mb-4 leading-tight"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            What is the SAT by <br />
            <span className="inline-block bg-[#f3eaca] text-black font-extrabold px-3 -mb-1 border-b-2 border-indigo-700">
              BM Academy?
            </span>
          </h1>

          <p className="text-gray-200 text-sm mb-6" data-aos="fade-up" data-aos-delay="250">
            The Scholarship Assessment Test (SAT) is a FREE 25–30 minute aptitude test <br />
            designed to help you win big savings on your course fees based on your logical <br />
            and reasoning skills.
          </p>

          <ul className="text-gray-200 text-sm space-y-2 mb-6" data-aos="fade-up" data-aos-delay="300">
            <li className="flex items-center gap-2">
              <Check className="text-green-200 w-4 h-4" />
              <span>Results in 48 hrs via Email & WhatsApp</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="text-green-200 w-4 h-4" />
              <span>Scholarships worth up to ₹15,000</span>
            </li>
          </ul>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-4" data-aos="fade-up" data-aos-delay="350">
            Mode:
          </h2>

          <div className="flex flex-wrap gap-3 mb-3" data-aos="fade-up" data-aos-delay="400">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full shadow-sm">
              <School size={16} />
              <span>School Students</span>
              <span className="hidden sm:inline text-xs text-gray-500">(10th–12th)</span>
            </span>

            <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full shadow-sm">
              <GraduationCap size={16} />
              <span>College Students</span>
            </span>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full md:w-1/2 flex justify-center" data-aos="zoom-in" data-aos-delay="500">
          <img src={About} alt="rightSideImage" className="w-full rounded-xl shadow-md" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
