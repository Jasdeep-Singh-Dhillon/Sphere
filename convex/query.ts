import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getJoinedServers = query({
  args: {
    userid: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userId", (q) => q.eq("userid", args.userid))
      .unique();

    if (!user) {
      return null;
    }
    const joined = await ctx.db
      .query("joinedServers")
      .withIndex("by_userid", (q) => q.eq("userid", user._id))
      .collect();
    const servers = await Promise.all(
      joined.map(async (server) => await ctx.db.get(server.serverid)),
    );
    return servers;
  },
});

export const getChannels = query({
  args: {
    id: v.id("servers"),
  },
  handler: async (ctx, args) => {
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_serverId", (q) => q.eq("serverid", args.id))
      .collect();
    return channels;
  },
});

export const getCategoryChannels = query({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_categoryId", (q) => q.eq("categoryid", args.id))
      .collect();
    return channels;
  },
});

export const getServerCategories = query({
  args: {
    id: v.id("servers"),
  },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_serverId", (q) => q.eq("serverid", args.id))
      .collect();
    return categories;
  },
});

export const getCategories = query({
  args: {
    id: v.id("servers"),
  },
  handler: async (ctx, args) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_serverId", (q) => q.eq("serverid", args.id))
      .collect();

    const categoriesChannels = await Promise.all(
      (categories ?? []).map(async (category) => {
        const channels = await ctx.db
          .query("channels")
          .filter((q) => q.eq(q.field("categoryid"), category._id.toString()))
          .collect();
        const sendChannels = channels.map((channel) => {
          return { name: channel.name, id: channel._id, type: channel.type };
        });

        return {
          ...category,
          channels: sendChannels,
        };
      }),
    );
    return categoriesChannels;
  },
});

export const getMessages = query({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    let messages = await ctx.db
      .query("messages")
      .withIndex("by_channelId", (q) => q.eq("channelid", args.id))
      .order("desc")
      .collect();
    messages = messages.sort((a, b) => a._creationTime - b._creationTime);
    const result = await Promise.all(
      (messages ?? []).map(async (message) => {
        const user = await ctx.db.get(message.userid);
        return {
          username: user?.username,
          image: user?.image,
          id: message._id,
          content: message.type
            ? await ctx.storage.getUrl(message.content as Id<"_storage">)
            : message.content,
          replyMessageId: message.replyMessageid,
          time: message._creationTime,
          type: message.type,
        };
      }),
    );
    return result;
  },
});

export const getUsername = query({
  args: {
    userid: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userId", (q) => q.eq("userid", args.userid))
      .unique();
    if (!user) return null;
    return user.username;
  },
});

export const isUsernameAvailable = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();
    return user ? true : false;
  },
});

export const getServerInfo = query({
  args: {
    serverid: v.id("servers"),
  },
  handler: async (ctx, args) => {
    const server = ctx.db.get(args.serverid);
    return server;
  },
});

export const getServerRoles = query({
  args: {
    serverid: v.id("servers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roles")
      .withIndex("by_serverid", (q) => q.eq("serverid", args.serverid))
      .collect();
  },
});

export const getServerMembers = query({
  args: {
    serverid: v.id("servers"),
  },
  handler: async (ctx, { serverid }) => {
    const members = await ctx.db
      .query("joinedServers")
      .withIndex("by_serverid", (q) => q.eq("serverid", serverid))
      .collect();

    const membersInfo = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userid);
        if (user) {
          const userRoles = await ctx.db
            .query("userRoles")
            .withIndex("by_userId_serverId", (q) => q.eq("userid", user._id))
            .filter((q) => q.eq(q.field("serverid"), serverid))
            .collect();
          const roles = await Promise.all(
            userRoles.map(async (role) => await ctx.db.get(role.roleid)),
          );
          return { ...user, memberSince: member._creationTime, roles };
        }
      }),
    );
    return membersInfo;
  },
});
