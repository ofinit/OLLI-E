import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis (serverless, pay-per-request — zero monthly fee)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Global rate limiter: 20 AI requests per user per minute.
 * Prevents bot-spamming and API credit draining.
 */
export const chatRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "ollie:chat",
});

/**
 * Auth rate limiter: 5 login attempts per IP per 15 minutes.
 * Prevents brute-force attacks.
 */
export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "ollie:auth",
});
