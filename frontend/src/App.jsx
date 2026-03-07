import { BrowserRouter, Routes, Route } from "react-router-dom"; 
 
import { Toaster } from "@/components/ui/toaster"; 
import Index from "./pages/Index";
import About from "./pages/About";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import Reviews from "./pages/Reviews";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardFaqs from "./pages/DashboardFAQs";
import DashboardSubmitIdea from "./pages/DashboardSubmitIdea";
import DashboardResults from "./pages/DashboardResults";
import DashboardCompare from "./pages/DashboardCompareIdeas";
import DashboardFeedback from "./pages/DashboardFeedback";
import DashboardProfile from "./pages/DashboardProfile"; 
import ProtectedRoute from "@/components/ProtectedRoute";
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from './redux/api/userApi';
import { setUser, setIsAuthenticated, setLoading } from './redux/features/userSlice';
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardAllResult from "./pages/DashboardAllResult";


export default function App() { 
  const { data, isLoading, isError } = useGetMeQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else if (isError || !data) {
      dispatch(setUser(null));
      dispatch(setIsAuthenticated(false));
      dispatch(setLoading(false));
    } else if (data) {
      dispatch(setUser(data));
      dispatch(setIsAuthenticated(true));
      dispatch(setLoading(false));
    }
  }, [data, isLoading, isError, dispatch]);

  return (
    <BrowserRouter>
     <Toaster position="top-right"/>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
       
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        <Route path="/dashboard/submit-idea" element={<ProtectedRoute><DashboardSubmitIdea /></ProtectedRoute>} />
        <Route path="/dashboard/results/:ideaId" element={<ProtectedRoute><DashboardResults /></ProtectedRoute>} />
        <Route path="/dashboard/results" element={<ProtectedRoute><DashboardAllResult/></ProtectedRoute>} />
        <Route path="/dashboard/feedback" element={<ProtectedRoute><DashboardFeedback /></ProtectedRoute>} /> 
        <Route path="/dashboard/faqs" element={<ProtectedRoute><DashboardFaqs /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardProfile /></ProtectedRoute>} />
         <Route path="/dashboard/compare" element={<ProtectedRoute><DashboardCompare /></ProtectedRoute>} />
      </Routes>
     
    </BrowserRouter>
  );
}

 
 