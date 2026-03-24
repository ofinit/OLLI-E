import { pgTable, text, timestamp, integer, uuid, boolean, decimal } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').notNull().unique(), // Link to Clerk Auth
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const wallets = pgTable('wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  balance: decimal('balance', { precision: 12, scale: 4 }).default("0").notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const aiModels = pgTable('ai_models', {
  id: uuid('id').defaultRandom().primaryKey(),
  nicheName: text('niche_name').notNull(), // e.g. "Website Builder"
  providerModelId: text('provider_model_id').notNull(), // e.g. "moonshot-v1-auto"
  systemPrompt: text('system_prompt').notNull(), // The strict OLLI-E identity rule
  baseCostPer1k: decimal('base_cost_per_1k', { precision: 12, scale: 6 }).notNull(),
  profitMarginPercent: integer('profit_margin_percent').default(50).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usageLogs = pgTable('usage_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  modelId: uuid('model_id').references(() => aiModels.id).notNull(),
  inputTokens: integer('input_tokens').notNull(),
  outputTokens: integer('output_tokens').notNull(),
  totalCostDeducted: decimal('total_cost_deducted', { precision: 12, scale: 6 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const userS3Configs = pgTable('user_s3_configs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  accessKeyId: text('access_key_id').notNull(), // Should be encrypted in production
  secretAccessKey: text('secret_access_key').notNull(), // Should be encrypted in production
  region: text('region').notNull(),
  bucketName: text('bucket_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const platformSettings = pgTable('platform_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  platformName: text('platform_name').default('OLLI-E AI').notNull(),
  supportEmail: text('support_email').default('support@olli-e.ai').notNull(),
  openRouterApiKey: text('openrouter_api_key'),
  neonDbUrl: text('neon_db_url'),
  upstashRedisUrl: text('upstash_redis_url'),
  clerkPublishableKey: text('clerk_publishable_key'),
  clerkSecretKey: text('clerk_secret_key'),
  razorpayKeyId: text('razorpay_key_id'),
  paypalClientId: text('paypal_client_id'),
  zwitchApiKey: text('zwitch_api_key'),
  instamojoAuthToken: text('instamojo_auth_token'),
  globalMarkup: integer('global_markup').default(40).notNull(),
  smartRounding: boolean('smart_rounding').default(true).notNull(),
  wholesaleEnabled: boolean('wholesale_enabled').default(true).notNull(),
  wholesaleThreshold: decimal('wholesale_threshold', { precision: 12, scale: 2 }).default("1000").notNull(),
  wholesaleDiscountRate: integer('wholesale_discount_rate').default(15).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const depositBonuses = pgTable('deposit_bonuses', {
  id: uuid('id').defaultRandom().primaryKey(),
  depositAmount: decimal('deposit_amount', { precision: 12, scale: 2 }).notNull(),
  bonusType: text('bonus_type').notNull(), // 'fixed' or 'percentage'
  bonusValue: decimal('bonus_value', { precision: 12, scale: 2 }).notNull(),
  isBestValue: boolean('is_best_value').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
