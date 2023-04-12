export interface Recommendation {
  userId: string;
  firstName: string;
  lastName: string;
  persona: string;
  designation: string;
}

export interface RecommendationService {
  getRecommendation(
    id: string,
    outcome: string,
    product: string,
    quarter: string
  ): Promise<Recommendation>;
}
