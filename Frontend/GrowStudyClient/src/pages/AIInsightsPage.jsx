import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAi } from "../context/AiContext";
import { useToast } from "../context/ToastContext";
import ResumeAnalysisCard from "../componets/ai/ResumeAnalysisCard";
import JobRecommendationList from "../componets/ai/JobRecommendationList";
import MatchScoreTable from "../componets/ai/MatchScoreTable";
import MatchScoreModal from "../componets/ai/MatchScoreModal";

export default function AIInsightsPage() {
  const toast = useToast();
  const {
    analysis, recommendations, batchScores, loading,
    fetchAnalysis, fetchRecommendations, fetchBatchScores
  } = useAi();

  const [selectedJobId, setSelectedJobId] = useState(null);

  const lastAnalyzeTime = useRef(0);

  useEffect(() => {
    fetchAnalysis();
    fetchRecommendations();
    fetchBatchScores();
  }, [fetchAnalysis, fetchRecommendations, fetchBatchScores]);

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
