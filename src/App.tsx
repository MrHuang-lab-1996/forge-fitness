import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ThemeProvider from "@/components/ThemeProvider";
import CalendarPage from "@/pages/CalendarPage";
import PlansPage from "@/pages/PlansPage";
import TrainingPage from "@/pages/TrainingPage";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/train/:date" element={<TrainingPage />} />
          <Route path="*" element={<Navigate to="/calendar" replace />} />
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}
