import { useEffect, useState } from "react";
import { Menu, X, Laptop, CheckCircle, MapPin, Clock, Download } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Logo from '../assets/img/bm.png'

const HeroSection = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

   

  }, []);

  return (
    <section
      id="home"
      className="bg-gradient-to-tr from-black via-slate-900 to-black text-white w-full bg-no-repeat bg-cover bg-center text-sm pb-44 "
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full">
        <a href="#">
          <img src={Logo} alt="Your Logo" className="h-10 md:h-12 w-auto" />
        </a>

        {/* Nav Links */}
        <div
          className={`z-50 ${
            menuOpen ? "max-md:w-full" : "max-md:w-0"
          } max-md:absolute max-md:top-0 max-md:left-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-full max-md:bg-black/50 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-8 font-medium`}
        >
          <a href="#home" className="hover:text-gray-400">Home</a>
          <a href="#about" className="hover:text-gray-400">About</a>
          <a href="#scholarship" className="hover:text-gray-400">Scholarship</a>
          <a href="#testimonials" className="hover:text-gray-400">Testimonials</a>
          <a href="#contact" className="hover:text-gray-400">Contact</a>
          <button
            onClick={() => setMenuOpen(false)}
            className="md:hidden bg-white hover:bg-black text-black p-2 rounded-md aspect-square font-medium transition"
          >
            <X />
          </button>
        </div>

        {/* Buttons */}
        <button
          onClick={() => window.location.href = "tel:+919944288271"}
          className="hidden md:block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition"
        >
          Contact Us
        </button>

        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
        >
          <Menu />
        </button>
      </nav>

      {/* Hero Content */}
      <div className="text-center mt-20 md:mt-32" data-aos="fade-up" data-aos-duration="1000">
        <h5 className="text-4xl md:text-7xl font-medium max-w-[950px] text-center mx-auto text-white">
          Learn Industry Skills + Get Scholarships <span className="text-yellow-500">up to 80%</span>
        </h5>
        <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6 max-md:px-2" data-aos="fade-up" data-aos-delay="200">
          <Laptop className="inline text-blue-500 mr-2" size={18} />
          Digital Marketing | Full Stack | Video Editing | AI
        </p>
        <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-2" data-aos="fade-up" data-aos-delay="400">
          <CheckCircle className="inline text-green-500 mr-2" size={18} />
          Take SAT → View Score → Unlock Fee → Pay via UPI
        </p>
        <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-2" data-aos="fade-up" data-aos-delay="600">
          <MapPin className="inline text-red-500 mr-2" size={18} />
          Courses Online + Offline | Tamil & English
        </p>
        <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-2" data-aos="fade-up" data-aos-delay="800">
          <Clock className="inline text-orange-500 mr-2" size={18} />
          Enroll Anytime – Start Instantly!
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="mx-auto w-full flex items-center justify-center gap-3 mt-6" data-aos="fade-up" data-aos-delay="1000">
        <button
          onClick={() => window.open("https://www.google.com/search?q=BM+Academy+reviews", "_blank")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition"
        >
          Google Reviews
        </button>
        <button
          onClick={() => alert("Download Brochure coming soon!")}
          className="flex items-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-6 py-3"
        >
          <span>Brochure</span>
          <Download size={16} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
