import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ResumeUpload from "./components/ResumeUpload";
import ResumeList from "./components/ResumeList";

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/">Upload Resume</Link>
            </li>
            <li>
              <Link to="/resumes">View Resumes</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ResumeUpload />} />
          <Route path="/resumes" element={<ResumeList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
