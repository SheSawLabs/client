import { ApiResponse } from "./common";

export interface Policy {
  id: string;
  title: string;
  description: string;
  application_period: string;
  eligibility_criteria: string;
  link: string;
  category: string;
  target_conditions: {
    income: string[];
    family_type: string[];
    location: string[];
    age: string[] | null;
  };
  created_at: string;
  updated_at: string;
}

export type PolicyListResponse = ApiResponse<Policy[]> & {
  filter: null;
};
