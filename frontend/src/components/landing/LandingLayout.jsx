import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "./Footer";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

const LandingLayout = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
 
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/faqs", label: "FAQs" },
    { to: "/reviews", label: "Reviews" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* White Navbar for internal pages */}
      <nav className="bg-white border-b border-border/30 px-4 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center  group">
            <img
              src={logo}
              alt="Start Up Mentor"
              className="w-14 h-14 rounded-lg object-cover transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-md font-bold text-foreground">
                Start Up
              </span>
              <span className="text-md font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
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
                    "relative px-4 py-2 font-large transition-all duration-300 rounded-full",
                    isActive
                      ? "text-primary bg-primary/10 font-bold"
                      : "text-foreground hover:text-foreground hover:bg-muted font-bold"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
 
          {/* Auth button */}
          {user ? (
          <Link to="/dashboard">
            <Button className="gradient-button text-white font-semibold px-6">
                <p>Dashboard</p>
            </Button>
          </Link>
            ) : (
          <Link to="/auth">
            <Button className="gradient-button text-white font-semibold px-6">
              Get Started
            </Button>
          </Link>
        )} 
        </div>
      </nav>

      {/* Content */}
      <div className="bg-white py-16 flex-1">
        <div className="px-4">{children}</div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingLayout;
