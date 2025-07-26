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

    await ctx.db.patch(userInfo?._id, { username: args.username });
    return true;
  },
});

export const deleteMessage = mutation({
  args: {
    messageid: v.id("messages"),
    userid: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageid);
    return message?.userid.toString() === args.userid
      ? await ctx.db.delete(args.messageid)
      : null;
  },
});

export const createAccount = mutation({
  args: {
    userid: v.string(),
    image: v.optional(v.string()),
    about: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    ctx.db.insert("usersInfo", { ...args, username: "" });
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
    const server = await ctx.db.insert("servers", {
      name: args.serverName,
      ownerid: userInfo._id,
      serverIcon: args.serverIcon,
      description: args.description,
    });
    await ctx.db.insert("joinedServers", {
      userid: userInfo._id,
      serverid: server,
    });

    return server;
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
    if (!user) return null;
    return ctx.db.insert("messages", {
      channelid: args.channelid,
      content: args.content,
      userid: user._id,
    });
  },
});

export const joinServer = mutation({
  args: {
    userid: v.string(),
    serverid: v.id("servers"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userId", (q) => q.eq("userid", args.userid))
      .unique();
    if (!user) return null;

    const joinedServers = await ctx.db
      .query("joinedServers")
      .withIndex("by_userid", (q) => q.eq("userid", user._id))
      .filter((q) =>
        q.and(
          q.eq(q.field("userid"), user._id),
          q.eq(q.field("serverid"), args.serverid),
        ),
      )
      .collect();

    if (joinedServers.length > 0) {
      return null;
    }

    return await ctx.db.insert("joinedServers", {
      userid: user._id,
      serverid: args.serverid,
    });
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendImage = mutation({
  args: {
    storageId: v.id("_storage"),
    userid: v.string(),
    channelid: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userId", (q) => q.eq("userid", args.userid))
      .unique();
    if (!user) return null;
    return ctx.db.insert("messages", {
      content: args.storageId,
      userid: user._id,
      channelid: args.channelid,
      type: "file",
    });
  },
});

export const editMessage = mutation({
  args: {
    messageid: v.id("messages"),
    userid: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userId", (q) => q.eq("userid", args.userid))
      .unique();
    if (!user) return null;

    const message = await ctx.db.get(args.messageid);
    return message?.userid === user._id
      ? await ctx.db.patch(args.messageid, { content: args.content })
      : null;
  },
});

export const createRole = mutation({
  args: {
    name: v.string(),
    permission: v.object({
      isAdmin: v.boolean(),
      manageRoles: v.boolean(),
      viewChannel: v.boolean(),
    }),
    serverid: v.id("servers"),
  },
  handler: async (ctx, args) => {
    const permissionid = await ctx.db.insert("permissions", args.permission);
    return await ctx.db.insert("roles", {
      name: args.name,
      permissionid,
      serverid: args.serverid,
      color: "",
    });
  },
});

export const addUserRole = mutation({
  args: {
    serverid: v.id("servers"),
    userid: v.id("usersInfo"),
    roleid: v.id("roles"),
  },
  handler: async (ctx, args) => {
    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_serverId", (q) => q.eq("userid", args.userid))
      .filter((q) =>
        q.and(
          q.eq(q.field("serverid"), args.serverid),
          q.eq(q.field("roleid"), args.roleid),
        ),
      )
      .first();

    if (userRole) return null;
    return await ctx.db.insert("userRoles", { ...args });
  },
});

export const removeUserRole = mutation({
  args: {
    userid: v.id("usersInfo"),
    roleid: v.id("roles"),
  },
  handler: async (ctx, args) => {
    const userRole = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_serverId", (q) => q.eq("userid", args.userid))
      .filter((q) => q.eq(q.field("roleid"), args.roleid))
      .unique();
    if (userRole) {
      ctx.db.delete(userRole._id);
      return userRole._id;
    }
    return null;
  },
});

export const editServerInfo = mutation({
  args: {
    serverid: v.id("servers"),
    servername: v.string(),
  },
  handler: async (ctx, { servername, serverid }) => {
    await ctx.db.patch(serverid, { name: servername });
  },
});
