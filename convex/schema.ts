"server only";

import { defineSchema, defineTable } from "convex/server";
import { Validator, v } from "convex/values";

// export const userSchema = {
//   name: v.string(),
//   displayName: v.string(),
//   email: v.string(),
//   emailVerified: v.optional(v.number()),
//   phone: v.optional(v.string()),
//   password: v.string(),
//   image: v.optional(v.string()),
//   about: v.optional(v.string()),
//   joined: v.optional(v.array(v.id("servers"))),
// };

export const userSchema = {
  email: v.string(),
  name: v.optional(v.string()),
  emailVerified: v.optional(v.number()),
  image: v.optional(v.string()),
  password: v.optional(v.string()),
  displayName: v.optional(v.string())
};

export const sessionSchema = {
  userId: v.id("users"),
  expires: v.number(),
  sessionToken: v.string(),
};

export const accountSchema = {
  userId: v.id("users"),
  type: v.union(
    v.literal("email"),
    v.literal("oidc"),
    v.literal("oauth"),
    v.literal("webauthn"),
  ),
  provider: v.string(),
  providerAccountId: v.string(),
  refresh_token: v.optional(v.string()),
  access_token: v.optional(v.string()),
  expires_at: v.optional(v.number()),
  token_type: v.optional(v.string() as Validator<Lowercase<string>>),
  scope: v.optional(v.string()),
  id_token: v.optional(v.string()),
  session_state: v.optional(v.string()),
};

export const verificationTokenSchema = {
  identifier: v.string(),
  token: v.string(),
  expires: v.number(),
};

export const authenticatorSchema = {
  credentialID: v.string(),
  userId: v.id("users"),
  providerAccountId: v.string(),
  credentialPublicKey: v.string(),
  counter: v.number(),
  credentialDeviceType: v.string(),
  credentialBackedUp: v.boolean(),
  transports: v.optional(v.string()),
};

const authTables = {
  users: defineTable(userSchema)
    .index("email", ["email"])
    .index("by_name", ["name"]),
  sessions: defineTable(sessionSchema)
    .index("sessionToken", ["sessionToken"])
    .index("userId", ["userId"]),
  accounts: defineTable(accountSchema)
    .index("providerAndAccountId", ["provider", "providerAccountId"])
    .index("userId", ["userId"]),
  verificationTokens: defineTable(verificationTokenSchema).index(
    "identifierToken",
    ["identifier", "token"],
  ),
  authenticators: defineTable(authenticatorSchema)
    .index("userId", ["userId"])
    .index("credentialID", ["credentialID"]),
};

export const serverSchema = {
  name: v.string(),
  serverIcon: v.string(),
  description: v.string(),
  ownerId: v.id("users"),
};

export const channelSchema = {
  name: v.string(),
  categoryId: v.id("categories"),
  // TODO: Add more types
  type: v.union(v.literal("text"), v.literal("voice")),
  serverId: v.id("servers"),
};

export const categorySchema = {
  name: v.string(),
  serverId: v.id("servers"),
};

export const messageSchema = {
  userId: v.id("users"),
  channelId: v.id("channels"),
  content: v.string(),
  replyMessageId: v.optional(v.id("messages")),
};

export const roleSchema = {
  serverId: v.id("servers"),
  name: v.string(),
  color: v.string(),
  permissionId: v.id("permissions"),
};

export const permissionSchema = {
  viewChannel: v.boolean(),
  manageRoles: v.boolean(),
  isAdmin: v.boolean(),
};

export const serverProfileSchema = {
  userId: v.id("users"),
  serverId: v.id("servers"),
  displayName: v.string(),
  userIcon: v.string(),
  about: v.string(),
};

export const userRoleSchema = {
  userId: v.id("users"),
  serverId: v.id("servers"),
  roleId: v.id("roles"),
};

export default defineSchema({
  ...authTables,
  servers: defineTable(serverSchema),
  channels: defineTable(channelSchema),
  categories: defineTable(categorySchema),
  messages: defineTable(messageSchema).index("by_channelId", ["channelId"]),
  roles: defineTable(roleSchema),
  permissions: defineTable(permissionSchema),
  serverProfiles: defineTable(serverProfileSchema),
  userRoles: defineTable(userRoleSchema),
});
