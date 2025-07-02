import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const setUsername = mutation({
  args: {
    userid: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const userInfo = await ctx.db
      .query("usersInfo")
      .withIndex("by_userId", (q) => q.eq("userid", args.userid))
      .unique();

    if (!userInfo) {
      return null;
    }

    return ctx.db.patch(userInfo?._id, { username: args.username });
  },
});

export const createAccount = mutation({
  args: {
    userid: v.string(),
    image: v.optional(v.string()),
    about: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    ctx.db.insert("usersInfo", { ...args, joined: [], username: "" });
  },
});

export const createServer = mutation({
  args: {
    serverName: v.string(),
    userid: v.string(),
    serverIcon: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userInfo = await ctx.db
      .query("usersInfo")
      .withIndex("by_userId", (q) => q.eq("userid", args.userid))
      .unique();

    if (!userInfo) {
      return null;
    }

    return ctx.db.insert("servers", {
      name: args.serverName,
      ownerid: userInfo._id,
      serverIcon: args.serverIcon,
      description: args.description,
    });
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    serverid: v.id("servers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      name: args.name,
      serverid: args.serverid,
    });
  },
});

export const createChannel = mutation({
  args: {
    serverid: v.id("servers"),
    categoryid: v.id("categories"),
    name: v.string(),
    type: v.union(v.literal("text"), v.literal("voice")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("channels", {
      serverid: args.serverid,
      categoryid: args.categoryid,
      name: args.name,
      type: args.type,
    });
  },
});

export const sendMessage = mutation({
  args: {
    channelid: v.id("channels"),
    content: v.string(),
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
    return ctx.db.insert("messages", {
      channelid: args.channelid,
      content: args.content,
      userid: user._id,
    });
  },
});
