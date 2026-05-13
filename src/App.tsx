import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContexts";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import { lazy, Suspense } from "react";

// Lazy load pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminCareers = lazy(() => import("./pages/AdminCareers"));
const AdminCourses = lazy(() => import("./pages/AdminCourses"));
const AdminSkills = lazy(() => import("./pages/AdminSkills"));
const AdminLessons = lazy(() => import("./pages/AdminLessons"));
const AdminMajors = lazy(() => import("./pages/AdminMajors"));
const AdminFaculty = lazy(() => import("./pages/AdminFaculties"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const AdminInterests = lazy(() => import("./pages/AdminInterests"));
const AdminNews = lazy(() => import("./pages/AdminNews"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AIMatch = lazy(() => import("./pages/AIMatch"));
const LearningPath = lazy(() => import("./pages/LearningPath"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const News = lazy(() => import("./pages/News"));
const Bookmark = lazy(() => import("./pages/Bookmark"));
const TrackProgress = lazy(() => import("./pages/TrackProgress"));
const Home = lazy(() => import("./pages/Home"));
const CareerList = lazy(() => import("./pages/CareerList"));
const CareerDetail = lazy(() => import("./pages/CareerDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#F4F7FF]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A5DF9]"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />

        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />


              {/* User-facing Routes - Public */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/careers" element={<CareerList />} />
              <Route path="/careers/:id" element={<CareerDetail />} />
              <Route path="/news" element={<News />} />
              <Route path="/profile/:userId" element={<PublicProfile />} />

              {/* User-facing Routes - Protected */}
              <Route path="/ai-match" element={<ProtectedRoute><AIMatch /></ProtectedRoute>} />
              <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
              <Route path="/learning-path/:careerId" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
              <Route path="/learning-path/:careerId/course/:courseId" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
              <Route path="/track-progress" element={<ProtectedRoute><TrackProgress /></ProtectedRoute>} />
              <Route path="/bookmark" element={<ProtectedRoute><Bookmark /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

