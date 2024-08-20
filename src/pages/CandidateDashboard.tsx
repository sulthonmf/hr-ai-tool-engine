import React, { useEffect, useState } from "react";

const CandidateDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [similarityResults, setSimilarityResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      // Fetch candidates from your API
      const response = await fetch("http://localhost:5000/api/candidates");
      const data = await response.json();
      setCandidates(data.candidates);
    };

    fetchCandidates();
  }, []);

  const handleMatch = async () => {
    const resumeTexts = candidates.map((candidate) => candidate.extractedText);
    const results = await Promise.all(
      resumeTexts.map(async (text) => {
        const response = await fetch("http://localhost:5000/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText: text,
            jobDescriptionText: jobDescription,
          }),
        });
        return await response.json();
      })
    );
    setSimilarityResults(results);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Candidate Dashboard</h1>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter job description..."
        className="p-2 border rounded"
      />
      <button
        onClick={handleMatch}
        className="ml-2 p-2 bg-blue-500 text-white rounded"
      >
        Match Resumes
      </button>
      <ul>
        {similarityResults.map((result, index) => (
          <li key={index} className="mb-2 p-2 border rounded">
            <p>
              Candidate {index + 1}: Match Score {result.similarityScore}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CandidateDashboard;
