"server only";

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  servers: defineTable({
    name: v.string(),
    serverIcon: v.string(),
    description: v.string(),
    // ownerId: v.id("users"),
  }),
  channels: defineTable({
    name: v.string(),
    categoryId: v.id("categories"),
    // Add more types
    type: v.union(v.literal("text"), v.literal("voice")),
    serverId: v.id("servers"),
  }),
  categories: defineTable({
    name: v.string(),
    serverId: v.id("servers"),
  }),
  messages: defineTable({
    // userId: v.id("users"),
    channelId: v.id("channels"),
    content: v.string(),
    replyMessageId: v.optional(v.id("messages")),
  }).index("by_channelId", ["channelId"]),
  roles: defineTable({
    serverId: v.id("servers"),
    name: v.string(),
    color: v.string(),
    permissionId: v.id("permissions"),
  }),
  permissions: defineTable({
    viewChannel: v.boolean(),
    manageRoles: v.boolean(),
    isAdmin: v.boolean(),
  }),
  serverProfiles: defineTable({
    // userId: v.id("users"),
    serverId: v.id("servers"),
    displayName: v.string(),
    userIcon: v.string(),
    about: v.string(),
  }),
  userRoles: defineTable({
    // userId: v.id("users"),
    serverId: v.id("servers"),
    roleId: v.id("roles"),
  }),
});
