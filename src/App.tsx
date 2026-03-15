// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Index from "./pages/Index";
// import Users from "./pages/users";
// import Careers from "./pages/Careers";
// import Courses from "./pages/Courses";
// import Skills from "./pages/Skills";
// import Lessons from "./pages/Lessons";
// import Majors from "./pages/Majors";
// import News from "./pages/AdminNews";
// import Faculty from "./pages/Faculty";
// import Reports from "./pages/Reports";
// import Interests from "./pages/Interests";
// import NotFound from "./pages/NotFound";
// import AIMatch from "./pages/AIMatch"; 
// import LearningPath from "./pages/LearningPath"; // Imported new page

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />

//       <BrowserRouter
//         future={{
//           v7_startTransition: true,
//           v7_relativeSplatPath: true,
//         }}
//       >
//         <Routes>
//           {/* User-facing Routes */}
//           <Route path="/" element={<Navigate to="/ai-match" replace />} /> 
//           <Route path="/ai-match" element={<AIMatch />} /> 
//           <Route path="/learning-path" element={<LearningPath />} /> {/* Added route */}
//           <Route path="/not-found" element={<NotFound />} />

//           {/* Admin Routes */}
//           <Route path="/admin" element={<Index />} /> 
//           <Route path="/users" element={<Users />} />
//           <Route path="/reports" element={<Reports />} />
//           <Route path="/faculty" element={<Faculty />} />
//           <Route path="/majors" element={<Majors />} />
//           <Route path="/skills" element={<Skills />} />
//           <Route path="/interests" element={<Interests />} />
//           <Route path="/careers" element={<Careers />} />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/lessons" element={<Lessons />} />
//           <Route path="/news" element={<News />} />
          
//           {/* 404 Catch-all */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import Users from "./pages/users";
import Careers from "./pages/Careers";
import Courses from "./pages/Courses";
import Skills from "./pages/Skills";
import Lessons from "./pages/Lessons";
import Majors from "./pages/Majors";
import Faculty from "./pages/Faculty";
import Reports from "./pages/Reports";
import Interests from "./pages/Interests";
import NotFound from "./pages/NotFound";
import AIMatch from "./pages/AIMatch"; 
import LearningPath from "./pages/LearningPath";

// 1. Update these imports to separate User News and Admin News
import AdminNews from "./pages/AdminNews";
import News from "./pages/News"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* User-facing Routes */}
          <Route path="/" element={<Navigate to="/ai-match" replace />} /> 
          <Route path="/ai-match" element={<AIMatch />} /> 
          <Route path="/learning-path" element={<LearningPath />} /> 
          {/* 2. Add the user-facing News route here */}
          <Route path="/news" element={<News />} /> 
          <Route path="/not-found" element={<NotFound />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Index />} /> 
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/majors" element={<Majors />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/lessons" element={<Lessons />} />
          {/* 3. Give AdminNews a distinct path so it doesn't conflict */}
          <Route path="/admin-news" element={<AdminNews />} /> 
          
          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;