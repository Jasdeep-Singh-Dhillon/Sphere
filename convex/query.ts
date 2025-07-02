import { v } from "convex/values";
import { query } from "./_generated/server";

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
    const servers = await Promise.all(
      user.joined.map((id) =>
        ctx.db
          .query("servers")
          .withIndex("by_id", (q) => q.eq("_id", id))
          .unique(),
      ),
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
          content: message.content,
          replyMessageId: message.replyMessageid,
          time: message._creationTime,
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
