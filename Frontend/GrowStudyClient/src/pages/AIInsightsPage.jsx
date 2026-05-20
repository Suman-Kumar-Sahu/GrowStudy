import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { useAi } from "../context/AiContext";
import { useToast } from "../context/ToastContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/Axios";
import ResumeCard from "../componets/ResumeCard";
import ResumeAnalysisCard from "../componets/ai/ResumeAnalysisCard";
import JobRecommendationList from "../componets/ai/JobRecommendationList";
import MatchScoreTable from "../componets/ai/MatchScoreTable";
import MatchScoreModal from "../componets/ai/MatchScoreModal";

export default function AIInsightsPage() {
  const toast = useToast();
  const { user, setUser } = useContext(AuthContext);
  const {
    analysis, recommendations, batchScores, loading,
    fetchAnalysis, fetchRecommendations, fetchBatchScores
  } = useAi();

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const lastAnalyzeTime = useRef(0);
  const hasResume = !!user?.resumeUrl;

  useEffect(() => {
    if (hasResume) {
      fetchAnalysis();
      fetchRecommendations();
      fetchBatchScores();
    }
  }, [hasResume, fetchAnalysis, fetchRecommendations, fetchBatchScores]);

  const handleUpload = async (e) => {
    e?.preventDefault();
    if (!resumeFile) { toast.warn("No file selected", "Choose a resume first."); return; }
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(resumeFile.type)) { toast.error("Invalid file type", "Only PDF, DOC, DOCX allowed."); return; }
    if (resumeFile.size > 5 * 1024 * 1024) { toast.error("File too large", "Max 5MB allowed."); return; }

    setUploadLoading(true);
    const fd = new FormData();
    fd.append("resume", resumeFile);
    try {
      const res = await api.post("/users/upload-resume", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setUser(prev => ({ ...prev, resumeUrl: res.data.resumeUrl || "" }));
      setResumeFile(null);
      toast.success("Resume uploaded! ✅", "Your AI career insights are being generated...");
    } catch (err) {
      toast.error("Upload failed", err.response?.data?.message || "Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleReanalyze = useCallback(async () => {
    const now = Date.now();
    if (now - lastAnalyzeTime.current < 30000) {
      toast.warn("Rate Limit", "Please wait 30 seconds before re-analyzing.");
      return;
    }
    lastAnalyzeTime.current = now;

    await fetchAnalysis(true);
    toast.success("Analysis Updated", "Your resume metrics are fresh.");
  }, [fetchAnalysis, toast]);

  const handleScoreClick = useCallback((jobId) => {
    setSelectedJobId(jobId);
  }, []);

  if (!hasResume) {
    return (
      <div className="cn-page">
        <div style={{ marginBottom: 32 }}>
          <span className="cn-section-label">AI Tools</span>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 800, color: "var(--text-1)", marginTop: 4 }}>
            AI Career Insights 🧠
          </h1>
          <p style={{ color: "var(--text-2)", marginTop: 8, fontSize: "1.1rem" }}>
            Leverage artificial intelligence to optimize your profile and find the perfect job matches.
          </p>
        </div>

        <div style={{
          maxWidth: 600,
          margin: "40px auto",
          padding: "40px 24px",
          textAlign: "center",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-xl)",
          boxShadow: "var(--shadow-lg)"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-1)", marginBottom: 12 }}>
            Resume Required for AI Insights
          </h2>
          <p style={{ color: "var(--text-2)", fontSize: "1rem", lineHeight: 1.6, marginBottom: 24 }}>
            To generate personalized resume analysis, job recommendations, and match scores, please upload your resume first.
          </p>
          <ResumeCard
            resumeUrl=""
            resumeFile={resumeFile}
            setResumeFile={setResumeFile}
            handleUpload={handleUpload}
            loading={uploadLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cn-page">
      <div style={{ marginBottom: 32 }}>
        <span className="cn-section-label">AI Tools</span>
        <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 800, color: "var(--text-1)", marginTop: 4 }}>
          AI Career Insights 🧠
        </h1>
        <p style={{ color: "var(--text-2)", marginTop: 8, fontSize: "1.1rem" }}>
          Leverage artificial intelligence to optimize your profile and find the perfect job matches.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 24 }}>
        <ResumeAnalysisCard
          analysis={analysis}
          loading={loading.analysis}
          onReanalyze={handleReanalyze}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        <JobRecommendationList
          recommendations={recommendations}
          loading={loading.recommendations}
          onScoreClick={handleScoreClick}
        />
      </div>

      <div style={{ marginTop: 32 }}>
        <MatchScoreTable
          scores={batchScores}
          loading={loading.batchScores}
        />
      </div>

      {selectedJobId && (
        <MatchScoreModal
          jobId={selectedJobId}
          onClose={() => setSelectedJobId(null)}
        />
      )}
    </div>
  );
}

