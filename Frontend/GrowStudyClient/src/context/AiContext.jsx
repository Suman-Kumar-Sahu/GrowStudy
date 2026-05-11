import React, { createContext, useState, useContext, useCallback } from "react";
import api from "../api/Axios";

const AiContext = createContext(null);

export function AiProvider({ children }) {
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [batchScores, setBatchScores] = useState([]);

  const [loading, setLoading] = useState({
    analysis: true,
    recommendations: true,
    batchScores: true,
  });

  const fetchAnalysis = useCallback(async (force = false) => {
    if (!force && analysis) {
      setLoading(l => ({ ...l, analysis: false }));
      return;
    }

    setLoading(l => ({ ...l, analysis: true }));
    try {
      const res = await api.get("/ai/analyze-resume");
      setAnalysis(res.data.data);
    } catch (err) {
      if (!force && err.response?.status === 400) {
      } else {
        console.error("Resume Analysis Error:", err);
      }
    } finally {
      setLoading(l => ({ ...l, analysis: false }));
    }
  }, [analysis]);

  const fetchRecommendations = useCallback(async (force = false) => {
    if (!force && recommendations.length > 0) {
      setLoading(l => ({ ...l, recommendations: false }));
      return;
    }

    setLoading(l => ({ ...l, recommendations: true }));
    try {
      const res = await api.get("/ai/recommend-jobs");
      setRecommendations(res.data.data.recommendations || []);
    } catch (err) {
      if (err.response?.status !== 400 && err.response?.status !== 404) {
        console.error("Job Recommendation Error:", err);
      }
    } finally {
      setLoading(l => ({ ...l, recommendations: false }));
    }
  }, [recommendations]);

  const fetchBatchScores = useCallback(async (force = false) => {
    if (!force && batchScores.length > 0) {
      setLoading(l => ({ ...l, batchScores: false }));
      return;
    }

    setLoading(l => ({ ...l, batchScores: true }));
    try {
      const res = await api.get("/ai/batch-match-scores");
      setBatchScores(res.data.data.results || []);
    } catch (err) {
      if (err.response?.status !== 400 && err.response?.status !== 404) {
        console.error("Batch Score Error:", err);
      }
    } finally {
      setLoading(l => ({ ...l, batchScores: false }));
    }
  }, [batchScores]);

  return (
    <AiContext.Provider value={{
      analysis, recommendations, batchScores, loading,
      fetchAnalysis, fetchRecommendations, fetchBatchScores
    }}>
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  return useContext(AiContext);
}
