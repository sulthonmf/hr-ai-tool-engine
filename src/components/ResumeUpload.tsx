import React, { useState } from "react";

const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>(""); // Add job description text here
  const [matchingScores, setMatchingScores] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleJobDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const uploadResponse = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("uploadResponse", JSON.stringify(uploadResponse));

      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();

        // Check if `filename` and `extractedText` are present in the response
        if (uploadResult && uploadResult.file && uploadResult.file.filename) {
          setUploadStatus(
            `File uploaded successfully: ${uploadResult.file.filename}`
          );
          setExtractedText(uploadResult.extractedText || "");
        } else {
          setUploadStatus("Unexpected response structure.");
        }
      } else {
        const errorText = await uploadResponse.text();
        setUploadStatus(`Failed to upload the file. Error: ${errorText}`);
      }
    } catch (error) {
      setUploadStatus("Error uploading file. Please try again later.");
      console.error("Upload error:", error);
    }
  };

  const handleMatch = async () => {
    if (!extractedText) {
      setUploadStatus("Please upload a file before matching.");
      return;
    }

    try {
      const matchResponse = await fetch(
        "http://localhost:5000/api/match/match",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText: extractedText,
            jobDescriptionText: jobDescription,
          }),
        }
      );

      if (matchResponse.ok) {
        const matchResult = await matchResponse.json();
        setMatchingScores(matchResult);
      } else {
        const errorText = await matchResponse.text();
        setUploadStatus(`Failed to get matching scores. Error: ${errorText}`);
      }
    } catch (error) {
      setUploadStatus("Error getting matching scores. Please try again later.");
      console.error("Matching error:", error);
    }
  };

  return (
    <div className="p-4 border rounded">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}
      >
        <input type="file" onChange={handleFileChange} />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Upload Resume
        </button>
      </form>
      <textarea
        className="mt-4 w-full p-2 border rounded"
        placeholder="Enter job description here"
        rows={5}
        value={jobDescription}
        onChange={handleJobDescriptionChange}
      />
      <button
        type="button"
        onClick={handleMatch}
        className="mt-2 p-2 bg-green-500 text-white rounded"
      >
        Match Resume with Job Description
      </button>
      {uploadStatus && (
        <div className="mt-4 text-sm text-red-600">{uploadStatus}</div>
      )}
      {extractedText && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Extracted Text:</h3>
          <p>{extractedText}</p>
        </div>
      )}
      {matchingScores && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Matching Scores:</h3>
          <pre>{JSON.stringify(matchingScores, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
