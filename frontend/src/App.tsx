
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { useEffect, useState } from "react";
import { useToast } from "./hooks/use-toast";
import checkBackendHealth from "./utils/healthCheck";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import Forum from "./pages/Forum";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LearningDashboard from "./pages/LearningDashboard";
import NotFound from "./pages/NotFound";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <I18nextProvider i18n={i18n}>
              <TooltipProvider>
                <BackendHealthCheck />
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/mentor-dashboard" element={<MentorDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/course/:courseId/learn" element={<LearningDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </I18nextProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

// Component to check backend health and show toast if unavailable
function BackendHealthCheck() {
  const { toast } = useToast();
  const [checkedHealth, setCheckedHealth] = useState(false);
  
  useEffect(() => {
    const checkHealth = async () => {
      if (checkedHealth) return;
      
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        toast({
          title: "Backend Unavailable",
          description: "Unable to connect to the backend server. Some features may not work.",
          variant: "destructive",
          duration: 5000,
        });
      }
      setCheckedHealth(true);
    };
    
    checkHealth();
  }, [toast, checkedHealth]);
  
  return null;
}

export default App;
