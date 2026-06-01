export interface PersonalInfo {
  name: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
}

export interface FamilyFinancialInfo {
  maritalStatus: string;
  dependents: number | null;
  employmentStatus: string;
  monthlyIncome: number | null;
  housingStatus: string;
}

export interface SituationInfo {
  financialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
}

export interface ApplicationData {
  personal: Partial<PersonalInfo>;
  family: Partial<FamilyFinancialInfo>;
  situation: Partial<SituationInfo>;
}

export type Language = 'en' | 'ar';
export type StepNumber = 1 | 2 | 3;

export interface AiSuggestionResult {
  text: string;
  error?: boolean;
}
