import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { ProjectWorkspace } from './components/ProjectWorkspace';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard - list all projects */}
        <Route path="/projects" element={<Dashboard />} />

        {/* Project workspace - edit a specific project */}
        <Route path="/projects/:projectId" element={<ProjectWorkspace />} />

        {/* Redirect root to projects dashboard */}
        <Route path="/" element={<Navigate to="/projects" replace />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
