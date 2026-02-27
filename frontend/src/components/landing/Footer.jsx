import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="gradient-sidebar text-sidebar-foreground py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Start Up Mentor" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xl font-bold">Start Up Mentor</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8 text-sidebar-foreground/70">
            <Link to="/" className="hover:text-sidebar-foreground transition-colors">Home</Link>
            <Link to="/about" className="hover:text-sidebar-foreground transition-colors">About</Link>
            <Link to="/faqs" className="hover:text-sidebar-foreground transition-colors">FAQs</Link>
            <Link to="/contact" className="hover:text-sidebar-foreground transition-colors">Contact</Link>
          </div>

          {/* Copyright */}
          <div className="text-sidebar-foreground-/50 text-sm">
            © 2026 Start Up Mentor. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
