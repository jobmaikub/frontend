// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import Users from "./pages/users";
// import Careers from "./pages/Careers";
// import Courses from "./pages/Courses";
// import Skills from "./pages/Skills";
// import Lessons from "./pages/Lessons";
// import Majors from "./pages/Majors";
// import News from "./pages/News";
// import NotFound from "./pages/NotFound";
// import Faculty from "./pages/Faculty";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/Skills" element={<Skills />} />
//           <Route path="/Users" element={<Users />} />
//           <Route path="/careers" element={<Careers />} />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/lessons" element={<Lessons />} />
//           <Route path="/majors" element={<Majors />} />
//           <Route path="/news" element={<News />} />
//           <Route path="/faculty" element={<Faculty />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

//2
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import Users from "./pages/users";
// import Careers from "./pages/Careers";
// import Courses from "./pages/Courses";
// import Skills from "./pages/Skills";
// import Lessons from "./pages/Lessons";
// import Majors from "./pages/Majors";
// import News from "./pages/News";
// import Faculty from "./pages/Faculty";
// import NotFound from "./pages/NotFound";

// // Placeholders for new pages - Replace these with real imports once files are created
// const Reports = () => <div className="p-8">Reports Page Component</div>;
// const Interests = () => <div className="p-8">Interests Page Component</div>;

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/Users" element={<Users />} />
//           <Route path="/reports" element={<Reports />} />
//           <Route path="/faculty" element={<Faculty />} />
//           <Route path="/majors" element={<Majors />} />
//           <Route path="/Skills" element={<Skills />} />
//           <Route path="/interests" element={<Interests />} />
//           <Route path="/careers" element={<Careers />} />
//           <Route path="/courses" element={<Courses />} />
//           <Route path="/lessons" element={<Lessons />} />
//           <Route path="/news" element={<News />} />
          
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Users from "./pages/users";
import Careers from "./pages/Careers";
import Courses from "./pages/Courses";
import Skills from "./pages/Skills";
import Lessons from "./pages/Lessons";
import Majors from "./pages/Majors";
import News from "./pages/News";
import Faculty from "./pages/Faculty";
import Reports from "./pages/Reports";
import Interests from "./pages/Interests";
import NotFound from "./pages/NotFound";

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
          <Route path="/" element={<Index />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/majors" element={<Majors />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/news" element={<News />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
