import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContexts";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCareers from "./pages/AdminCareers";
import AdminCourses from "./pages/AdminCourses";
import AdminSkills from "./pages/AdminSkills";
import AdminLessons from "./pages/AdminLessons";
import AdminMajors from "./pages/AdminMajors";
import AdminFaculty from "./pages/AdminFaculties";
import AdminReports from "./pages/AdminReports";
import AdminInterests from "./pages/AdminInterests";
import AdminNews from "./pages/AdminNews";
import NotFound from "./pages/NotFound";
import AIMatch from "./pages/AIMatch"; 
import LearningPath from "./pages/LearningPath";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import News from "./pages/News";
import Home from "./pages/Home";
import CareerList from "./pages/CareerList";
import CareerDetail from "./pages/CareerDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* User-facing Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} /> 
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/careers" element={<ProtectedRoute><CareerList /></ProtectedRoute>} />
            <Route path="/careers/:id" element={<ProtectedRoute><CareerDetail /></ProtectedRoute>} />
            <Route path="/ai-match" element={<ProtectedRoute><AIMatch /></ProtectedRoute>} /> 
            <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} /> 
            {/* Add the user-facing News route here */}
            <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} /> 
            <Route path="/not-found" element={<NotFound />} />

            {/* Admin Routes - Protected by AdminProtectedRoute */}
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} /> 
            <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
            <Route path="/admin/reports" element={<AdminProtectedRoute><AdminReports /></AdminProtectedRoute>} />
            <Route path="/admin/faculties" element={<AdminProtectedRoute><AdminFaculty /></AdminProtectedRoute>} />
            <Route path="/admin/majors" element={<AdminProtectedRoute><AdminMajors /></AdminProtectedRoute>} />
            <Route path="/admin/skills" element={<AdminProtectedRoute><AdminSkills /></AdminProtectedRoute>} />
            <Route path="/admin/interests" element={<AdminProtectedRoute><AdminInterests /></AdminProtectedRoute>} />
            <Route path="/admin/careers" element={<AdminProtectedRoute><AdminCareers /></AdminProtectedRoute>} />
            <Route path="/admin/courses" element={<AdminProtectedRoute><AdminCourses /></AdminProtectedRoute>} />
            <Route path="/admin/lessons" element={<AdminProtectedRoute><AdminLessons /></AdminProtectedRoute>} />
            <Route path="/admin/news" element={<AdminProtectedRoute><AdminNews /></AdminProtectedRoute>} /> 
            
            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;