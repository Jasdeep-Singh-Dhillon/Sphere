import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userSchema = {
  username: v.string(),
  about: v.optional(v.string()),
  joined: v.array(v.id("servers")),
  userid: v.string(),
  image: v.optional(v.string()),
};

export const serverSchema = {
  name: v.string(),
  serverIcon: v.string(),
  description: v.string(),
  ownerid: v.id("usersInfo"),
};

export const channelSchema = {
  name: v.string(),
  categoryid: v.id("categories"),
  // TODO: Add more types
  type: v.union(v.literal("text"), v.literal("voice")),
  serverid: v.id("servers"),
};

export const categorySchema = {
  name: v.string(),
  serverid: v.id("servers"),
};

export const messageSchema = {
  userid: v.id("usersInfo"),
  channelid: v.id("channels"),
  content: v.string(),
  replyMessageid: v.optional(v.id("messages")),
};

export const roleSchema = {
  serverid: v.id("servers"),
  name: v.string(),
  color: v.string(),
  permissionid: v.id("permissions"),
};

export const permissionSchema = {
  viewChannel: v.boolean(),
  manageRoles: v.boolean(),
  isAdmin: v.boolean(),
};

export const serverProfileSchema = {
  userid: v.id("usersInfo"),
  serverid: v.id("servers"),
  displayName: v.string(),
  userIcon: v.string(),
  about: v.string(),
};

export const userRoleSchema = {
  userid: v.id("usersInfo"),
  serverid: v.id("servers"),
  roleId: v.id("roles"),
};

export default defineSchema({
  usersInfo: defineTable(userSchema)
    .index("by_userId", ["userid"])
    .index("by_username", ["username"]),
  servers: defineTable(serverSchema),
  channels: defineTable(channelSchema)
    .index("by_serverId", ["serverid"])
    .index("by_categoryId", ["categoryid"]),
  categories: defineTable(categorySchema).index("by_serverId", ["serverid"]),
  messages: defineTable(messageSchema).index("by_channelId", ["channelid"]),
  roles: defineTable(roleSchema),
  permissions: defineTable(permissionSchema),
  serverProfiles: defineTable(serverProfileSchema),
  userRoles: defineTable(userRoleSchema).index("by_userId", ["userid"]),
});
