/**
 * OLLI-E Real-Time Token Billing Utility
 * Calculates exact API cost and applies admin-configured profit margin.
 */

export interface CostCalculation {
  rawCost: number;
  profitAmount: number;
  totalDeducted: number;
}

/**
 * Calculates the final credit deduction including the admin profit margin.
 * @param inputTokens   - Number of tokens in the user's prompt
 * @param outputTokens  - Number of tokens in the model's response
 * @param baseCostPer1k - Raw API cost per 1000 tokens (from ai_models table)
 * @param profitMarginPercent - Admin-set profit %, e.g. 50 = 50%
 */
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  baseCostPer1k: number,
  profitMarginPercent: number
): CostCalculation {
  const totalTokens = inputTokens + outputTokens;
  const rawCost = (totalTokens / 1000) * baseCostPer1k;
  const profitAmount = rawCost * (profitMarginPercent / 100);
  const totalDeducted = rawCost + profitAmount;
  return { rawCost, profitAmount, totalDeducted };
}

/**
 * Checks if a user's wallet has sufficient balance for an estimated request.
 * Blocks the request if balance is zero or would go negative.
 */
export function hasSufficientBalance(balance: number, estimatedCost: number): boolean {
  return balance > 0 && balance >= estimatedCost;
}
