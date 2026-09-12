import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const enquiries = sqliteTable('enquiries', {
  id: text('id').primaryKey(), payloadHash: text('payload_hash').notNull(),
  reference: text('reference').notNull().unique(), data: text('data').notNull(),
  status: text('status').notNull().default('new'), version: integer('version').notNull().default(1),
  createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(),
}, t => [index('idx_enquiries_created').on(t.createdAt), index('idx_enquiries_status_created').on(t.status, t.createdAt)]);
export const attachments = sqliteTable('attachments', {
  id: text('id').primaryKey(), enquiryId: text('enquiry_id').notNull().references(() => enquiries.id),
  objectKey: text('object_key').notNull(), name: text('name').notNull(), mime: text('mime').notNull(), size: integer('size').notNull(),
}, t => [index('idx_attachments_enquiry').on(t.enquiryId)]);
export const events = sqliteTable('enquiry_events', {
  id: text('id').primaryKey(), enquiryId: text('enquiry_id').notNull().references(() => enquiries.id),
  actor: text('actor').notNull(), message: text('message').notNull(), createdAt: text('created_at').notNull(),
}, t => [index('idx_events_enquiry').on(t.enquiryId, t.createdAt)]);
export const limits = sqliteTable('rate_limits', { key: text('key').primaryKey(), count: integer('count').notNull(), expiresAt: integer('expires_at').notNull() });
