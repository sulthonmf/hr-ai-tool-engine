import React from "react";
import ResumeUpload from "../components/ResumeUpload";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI-Powered HR Tool</h1>
      <p className="mb-4">Upload a resume to get started:</p>
      <ResumeUpload />
    </div>
  );
};

export default Home;
