import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ThemeProvider } from "./context/ThemeContext";
import DashboardLayout from "./Layouts/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MyTasksPage from "./pages/dashboard/MyTasksPage";
import ProjectsPage from "./pages/dashboard/ProjectsPage";
import TeamPage from "./pages/dashboard/team/TeamPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="my-tasks" element={<MyTasksPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="team" element={<TeamPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
