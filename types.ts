
export interface CareerRecommendation {
  role: string;
  description: string;
  matchPercentage: number;
  salaryRange: string;
  marketDemand: 'Low' | 'Medium' | 'High';
  skillsToLearn: string[];
  roadmap: RoadmapStep[];
  pros: string[];
  cons: string[];
}

export interface RoadmapStep {
  month: string;
  milestone: string;
  resources: string[];
}

export interface UserProfile {
  skills: string[];
  interests: string[];
  education: string;
  experienceLevel: string;
  workPreference: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  personalityTraits: string[];
}

export enum AppState {
  WELCOME = 'WELCOME',
  ASSESSMENT = 'ASSESSMENT',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS'
}
