import {
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  MapPin,
} from "lucide-react";
import Logo from '../assets/img/bm.png'
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="px-6 md:px-16 lg:px-24 xl:px-32 bg-gradient-to-tl from-black via-slate-900 to-black">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-300">
        {/* Left Column */}
        <div className="flex-1 min-w-[250px]">
          <a href="#">
            <img src={Logo} alt="BM Academy" style={{ height: "55px", width: "auto" }} />
          </a>
          <p className="max-w-sm mt-6">
            BM Academy offers hands-on training in courses like Digital Marketing, Web Development, and Cloud
            Computing. With expert guidance and career support, we help you unlock your potential and grow professionally.
          </p>
            {/* Social Links */}
          <div className="flex-1 min-w-[150px]">
            <h3 className="font-semibold text-base mb-3 md:mb-5">Follow Us</h3>
            <div className="flex gap-4 text-gray-300">
              <a href="https://www.instagram.com/bmacademypondy/" target="_blank" rel="noreferrer" className="hover:text-white"><Instagram size={20} /></a>
              <a href="https://x.com/BMACADEMYPONDY" target="_blank" rel="noreferrer" className="hover:text-white"><Twitter size={20} /></a>
              <a href="https://www.facebook.com/people/BM-Academy/61566753898165/" target="_blank" rel="noreferrer" className="hover:text-white"><Facebook size={20} /></a>
              <a href="https://www.youtube.com/@bmacademypondy" target="_blank" rel="noreferrer" className="hover:text-white"><Youtube size={20} /></a>
            </div>
          </div>
        </div>

        {/* Right Columns */}
        <div className="flex flex-col md:flex-row justify-between w-full md:w-[65%] gap-10">
          {/* Quick Links */}
          <div className="flex-1 min-w-[150px]">
            <h3 className="font-semibold text-base mb-3 md:mb-5">Quick Links</h3>
            <ul className="text-sm space-y-1">
              <li><a href="#home" className="hover:underline transition">Home</a></li>
              <li><a href="#Services" className="hover:underline transition">Services</a></li>
              <li><a href="#scholarship" className="hover:underline transition">Scholarship</a></li>
              <li><a href="#testimonials" className="hover:underline transition">Testimonials</a></li>
            </ul>
          </div>

        

          {/* Contact Info */}
          <div className="flex-1 min-w-[180px]">
            <h3 className="font-semibold text-base mb-3 md:mb-5">Need Help?</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="tel:+919944940051" className="flex items-center gap-2 hover:text-white transition">
                  <Phone size={16} /> +91 99449 40051
                </a>
              </li>
              <li>
                <a href="mailto:admin@abmgroups.org" className="flex items-center gap-2 hover:text-white transition">
                  <Mail size={16} /> admin@abmgroups.org
                </a>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div className="flex-1 min-w-[250px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9605.494660602379!2d79.83609451294072!3d11.961680735595172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a53636a1752dc05%3A0xaa5795ccc1815bf7!2sBM%20Academy!5e1!3m2!1sen!2sin!4v1749880774336!5m2!1sen!2sin"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BM Academy Map"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <p className="py-4 text-center text-sm md:text-base text-gray-200">
        © {currentYear} <a href="https://thebmacademy.com/" target="_blank" rel="noreferrer" className="text-yellow-400 hover:underline">BM Academy</a>. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
