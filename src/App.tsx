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
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/ForgetPassword";
import { TasksProvider } from "./context/TasksContext";
import TaskDetails from "./pages/TaskDetails";
import NotificationsPage from "./pages/dashboard/NotificationsPage";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/dashboard" element={<TasksProvider><DashboardLayout /></TasksProvider>}>
            <Route index element={<DashboardPage />} />
            <Route path="my-tasks" element={<MyTasksPage />} />
            <Route path="tasks/:id" element={<TaskDetails />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
