import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
// import { useGetMeQuery } from "@/redux/api/authApi";

const Navbar = () => {
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/faqs", label: "FAQs" },
    { to: "/reviews", label: "Reviews" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1  group">
          <img
            src={logo}
            alt="Start Up Mentor"
            className="w-10 h-10 rounded-lg object-cover transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-md font-bold text-white">Start Up</span>
            <span className="text-md font-bold bg-gradient-to-r from-pink-300 via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              Mentor
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative px-4 py-2 font-medium transition-all duration-300 rounded-full",
                  isActive
                    ? "text-white bg-white/20 backdrop-blur-sm"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth button */}
      {user ? (
        <Link to="/dashboard">
          <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-6">
              <p>Dashboard</p>
          </Button>
        </Link>
      ) : (
        <Link to="/auth">
          <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-6">
            Get Started
          </Button>
        </Link>
        )} 
      </div>
    </nav>
  );
};

export default Navbar;
