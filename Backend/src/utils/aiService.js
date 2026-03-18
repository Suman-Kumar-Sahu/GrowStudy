import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

//  Analyze a resume and return structured insights
export const analyzeResume = async (resumeText) => {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are an expert HR consultant and resume analyst. Analyze the following resume and return a JSON object with this exact structure:
{
  "summary": "2-3 sentence professional summary of the candidate",
  "skills": ["skill1", "skill2", ...],
  "experienceLevel": "Entry | Mid | Senior | Executive",
  "totalExperienceYears": number,
  "education": [{ "degree": "", "field": "", "institution": "" }],
  "strengths": ["strength1", ...],
  "weaknesses": ["area_to_improve1", ...],
  "suggestedRoles": ["role1", "role2", ...],
  "atsScore": number (0-100, how ATS-friendly the resume is),
  "improvements": ["specific improvement suggestion1", ...]
}

Return ONLY the JSON object, no extra text.

Resume:
${resumeText}`,
      },
    ],
  });

  const raw = response.content[0].text.trim();
  return JSON.parse(raw);
};


// Recommend jobs based on candidate profile and available jobs list
export const recommendJobs = async (candidateProfile, jobsList) => {
  const jobsSummary = jobsList.map((job, i) => ({
    index: i,
    id: job._id,
    title: job.title,
    skills: job.skills || [],
    experience: job.experienceRequired || "",
    location: job.location || "",
    description: (job.description || "").slice(0, 300),
  }));

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `You are a job matching expert. Based on the candidate's profile, recommend the best matching jobs from the list.

Candidate Profile:
${JSON.stringify(candidateProfile, null, 2)}

Available Jobs:
${JSON.stringify(jobsSummary, null, 2)}

Return a JSON array of recommended job IDs with match scores, sorted by best match first:
[
  { "jobId": "job_id_here", "matchScore": 92, "reason": "Short reason why this job fits" }
]

Return top 5 matches only. Return ONLY the JSON array, no extra text.`,
      },
    ],
  });

  const raw = response.content[0].text.trim();
  return JSON.parse(raw);
};

/**
 * Calculate match score between a resume/profile and a specific job
 */
export const calculateMatchScore = async (candidateProfile, job) => {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are a recruitment expert. Analyze how well this candidate matches the job and return a detailed match report.

Candidate Profile:
${JSON.stringify(candidateProfile, null, 2)}

Job Details:
Title: ${job.title}
Description: ${job.description}
Required Skills: ${(job.skills || []).join(", ")}
Experience Required: ${job.experienceRequired || "Not specified"}
Location: ${job.location || "Not specified"}

Return a JSON object with this exact structure:
{
  "overallScore": number (0-100),
  "skillsMatch": {
    "score": number (0-100),
    "matched": ["matched_skill1", ...],
    "missing": ["missing_skill1", ...]
  },
  "experienceMatch": {
    "score": number (0-100),
    "comment": "brief comment"
  },
  "verdict": "Strong Match | Good Match | Partial Match | Weak Match",
  "pros": ["pro1", "pro2", ...],
  "cons": ["con1", "con2", ...],
  "recommendation": "1-2 sentence hiring recommendation"
}

Return ONLY the JSON object, no extra text.`,
      },
    ],
  });

  const raw = response.content[0].text.trim();
  return JSON.parse(raw);
};