import { Children, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  HelpCircle,
  MessageSquare,
  Star,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/redux/api/authApi";
import { logout as logoutSlice } from "@/redux/features/userSlice";
const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Lightbulb, label: "Submit Idea", path: "/dashboard/submit-idea" },
  { icon: Star, label: "Results", path: "/dashboard/results" },
  // { icon: Scale, label: "Compare Ideas", path: "/dashboard/compare" },
  { icon: MessageSquare, label: "Feedback", path: "/dashboard/feedback" },
  { icon: HelpCircle, label: "FAQs", path: "/dashboard/faqs" },
];

const DashboardLayout = ({ children }) => {

  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const { isLoading, error } = useGetMeQuery();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  const [logoutApi] = useLogoutMutation();

  if (isLoading) return <Loader />;


  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutSlice());
      navigate("/");
    } catch (err) {
      console.log("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex w-full">

      <aside
        className={cn(
          "gradient-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 relative",
          collapsed ? "w-20" : "w-72"
        )}
      >

        <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
          <img src={logo} alt="Start Up Mentor" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-md text-sidebar-foreground">Start Up</span>
              <span className="font-bold text-md bg-gradient-to-r from-pink-300 via-purple-200 to-cyan-200 bg-clip-text text-transparent">Mentor</span>
              <span className="text-xs text-sidebar-foreground/60">Innovate & Grow</span>
            </div>
          )}
        </div>


        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>


        <div className="p-4">
          <Link
            to="/dashboard/submit-idea"
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl bg-sidebar-accent border border-sidebar-border",
              collapsed && "justify-center p-3"
            )}
          >
            <div className="w-8 h-8 rounded-lg gradient-button flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>

            {!collapsed && (
              <div>
                <div className="font-semibold text-sm">Your Ideas</div>
                <div className="text-xs text-sidebar-foreground/60">
                  Track and manage your startup concepts
                </div>
              </div>
            )}
          </Link>
        </div>


        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center hover:bg-sidebar-primary transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">

        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">

              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back to your workspace {user?.name}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-[2px]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user?.avatar?.url ? (
                      <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
                <span>Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-destructive"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
