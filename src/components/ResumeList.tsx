import React, { useState, useEffect } from "react";

interface Resume {
  filename: string;
  extractedText: string;
}

const ResumeList: React.FC = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/resumes");
        if (response.ok) {
          const data = await response.json();
          setResumes(data.resumes);
        } else {
          console.error("Failed to fetch resumes");
        }
      } catch (error) {
        console.error("Error fetching resumes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Uploaded Resumes</h2>
      <ul>
        {resumes.length > 0 ? (
          resumes.map((resume) => (
            <li key={resume.filename} className="border-b py-2">
              <h3 className="font-bold">{resume.filename}</h3>
              <p>{resume.extractedText}</p>
            </li>
          ))
        ) : (
          <p>No resumes available.</p>
        )}
      </ul>
    </div>
  );
};

export default ResumeList;
