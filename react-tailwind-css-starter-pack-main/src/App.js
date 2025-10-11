import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentDashboard from "../src/components/StudentDashboard"
import Profile from "./pages/Profile";
import CheckAttendance from "./pages/CheckAttendance";
import AttendanceResults from "./pages/AttendanceResults";
import TeacherDashboard from "./components/TeacherDashboard";
import AttendancePage from "./components/AttendancePage";
import OcrTranscriptionPage from "./components/OCRTranscriptionPage";
import AttendanceDetail from "./components/AttendenceDetail";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/attendance-results/:dateString" element={<AttendanceResults />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard/>}/>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/check-attendance" element={<CheckAttendance />} />
          <Route path="/attendance/:className" element={<AttendancePage />} />
          {/* <Route path="/ocr-transcription/:className" element={<OcrTranscriptionPage />} /> */}
          <Route path="/attendance-detail" element={<AttendanceDetail />} /> 

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
