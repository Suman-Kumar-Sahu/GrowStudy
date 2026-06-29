import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

//Helper: Safe JSON parse 
const safeParseJSON = (text) => {
  const cleaned = text.trim().replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
};

// Analyze Resume 
export const analyzeResume = async (resumeText) => {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1500,
    messages: [
      {
        role: "system",
        content: "You are an expert HR consultant. You always respond with valid JSON only. No markdown, no explanation, no extra text. All numeric scores are integers from 0 to 100."
      },
      {
        role: "user",
        content: `Analyze the following resume and return a JSON object with this exact structure:
{
  "summary": "2-3 sentence professional summary of the candidate",
  "skills": ["skill1", "skill2"],
  "experienceLevel": "Entry | Mid | Senior | Executive",
  "totalExperienceYears": 0,
  "education": [{ "degree": "", "field": "", "institution": "" }],
  "strengths": ["strength1"],
  "weaknesses": ["area_to_improve1"],
  "suggestedRoles": ["role1", "role2"],
  "atsScore": integer from 0 to 100 (e.g. 78, 85, 92 — NOT 7.8 or 8),
  "improvements": ["improvement1"]
}

ATS Score Guide:
- 90-100: Excellent formatting, strong keywords, highly ATS-friendly
- 70-89:  Good resume with minor issues
- 50-69:  Average, needs improvement
- Below 50: Poor ATS compatibility

Return ONLY the JSON object.

Resume:
${resumeText}`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content || "";
  return safeParseJSON(raw);
};
// Recommend Jobs 
export const recommendJobs = async (candidateProfile, jobsList) => {
  const jobsSummary = jobsList.map((job) => ({
    id: job._id,
    title: job.title,
    skills: job.skillsRequired || [],
    experience: job.experienceRequired || "",
    location: job.location || "",
    description: (job.description || "").slice(0, 300),
  }));

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `You are a job matching expert. Based on the candidate's profile, recommend the best matching jobs from the list.

        Candidate Profile:
        ${JSON.stringify(candidateProfile, null, 2)}

        Available Jobs:
        ${JSON.stringify(jobsSummary, null, 2)}

        Return a JSON array of top 5 matches sorted by best match first:
        [
          { "jobId": "job_id_here", "matchScore": 92, "reason": "Short reason why this job fits" }
        ]

        Return ONLY the JSON array, no extra text, no markdown backticks.`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content || "";
  return safeParseJSON(raw);
};

//Calculate Match Score
export const calculateMatchScore = async (candidateProfile, job) => {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are a recruitment expert. Analyze how well this candidate matches the job.

Candidate Profile:
${JSON.stringify(candidateProfile, null, 2)}

Job Details:
Title: ${job.title}
Description: ${job.description || ""}
Required Skills: ${(job.skillsRequired || []).join(", ")}  
Experience Required: ${job.experienceRequired || "Not specified"}
Location: ${job.location || "Not specified"}

Return a JSON object with this exact structure:
{
  "overallScore": 0,
  "skillsMatch": {
    "score": 0,
    "matched": ["skill1"],
    "missing": ["skill2"]
  },
  "experienceMatch": {
    "score": 0,
    "comment": "brief comment"
  },
  "verdict": "Strong Match | Good Match | Partial Match | Weak Match",
  "pros": ["pro1"],
  "cons": ["con1"],
  "recommendation": "1-2 sentence hiring recommendation"
}

Return ONLY the JSON object, no extra text, no markdown backticks.`,
      },
    ],
  });

  const raw = response.choices[0]?.message?.content || "";
  return safeParseJSON(raw);
};