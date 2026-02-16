
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CareerRecommendation } from "../types";

export const getCareerRecommendations = async (profile: UserProfile): Promise<CareerRecommendation[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    You are a world-class career strategist. Analyze this profile and recommend the top 3 career paths.
    CRITICAL: Do NOT bias toward technology/coding. Explore ALL industries including:
    - Physical/Athletic (Sports, Personal Training, Outdoors, Defense)
    - Business & Entrepreneurship (Sales, Strategy, Finance, Real Estate)
    - Skilled Trades & Crafts (Culinary, Carpentry, Aviation, Automotive)
    - Creative & Performing Arts (Design, Music, Acting, Writing)
    - Social & Scientific (Medicine, Psychology, Research, Education)

    Profile:
    - Talents/Skills: ${profile.skills.join(', ')}
    - Interests/Passions: ${profile.interests.join(', ')}
    - Education: ${profile.education}
    - Experience: ${profile.experienceLevel}
    - Work Environment: ${profile.workPreference}
    - Personality/Style: ${profile.personalityTraits.join(', ')}

    Provide a detailed analysis including match percentage, salary range (use market data), market demand, and a specific 6-month roadmap for each path.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            description: { type: Type.STRING },
            matchPercentage: { type: Type.NUMBER },
            salaryRange: { type: Type.STRING },
            marketDemand: { type: Type.STRING },
            skillsToLearn: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  milestone: { type: Type.STRING },
                  resources: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["month", "milestone", "resources"]
              }
            },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["role", "description", "matchPercentage", "salaryRange", "marketDemand", "skillsToLearn", "roadmap", "pros", "cons"]
        }
      }
    }
  });

  try {
    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid AI response format");
  }
};
