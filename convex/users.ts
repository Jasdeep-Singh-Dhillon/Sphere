import { v } from "convex/values";
import {
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";

const getUser = async (ctx: QueryCtx | MutationCtx, userid: string) => {
  const user = await ctx.db
    .query("usersInfo")
    .withIndex("by_userid", (q) => q.eq("userid", userid))
    .unique();
  return user ? user : null;
};

export const getInfo = internalQuery({
  args: {
    userid: v.string(),
  },
  handler: async (ctx, { userid }) => {
    const user = await getUser(ctx, userid);
    if (!user) return null;
    return { ...user, _id: undefined };
  },
});

export const getUsername = query({
  args: { userid: v.string() },
  handler: async (ctx, { userid }) => {
    return (await getUser(ctx, userid))?.username;
  },
});

export const getJoined = query({
  args: {
    userid: v.string(),
  },
  handler: async (ctx, { userid }) => {
    const user = await getUser(ctx, userid);
    if (!user) return null;
    const joined = await ctx.db
      .query("joined")
      .withIndex("by_userid", (q) => q.eq("userid", user._id))
      .collect();
    const servers = await Promise.all(
      joined.map(async (server) => await ctx.db.get(server.serverid)),
    );
    return servers;
  },
});

export const setUsername = mutation({
  args: {
    userid: v.string(),
    username: v.string(),
  },
  handler: async (ctx, { userid, username }) => {
    const user = await getUser(ctx, userid);
    if (!user) return null;
    await ctx.db.patch(user._id, { username });
    return true;
  },
});

export const isUsernameAvailable = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, { username }) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();
    return user ? true : false;
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

export const addRole = mutation({
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

export const removeRole = mutation({
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

export const getCustomerId = query({
  args: {
    userid: v.string()
  },
  handler: async (ctx, {userid}) => {
    const user = await getUser(ctx, userid);
    if (!user) return null;
    
    return user.customerid;
  }
})

export const setSubscribed = mutation({
  args: {
    userid: v.string(),
    customerid: v.string()
  },
  handler: async (ctx, { userid, customerid }) => {
    const user = await getUser(ctx, userid);
    if (!user) return null;

    ctx.db.patch(user._id, { customerid });
  },
});

export const removeSubscribed = mutation({
  args: {
    userid: v.string(),
    customerid: v.string()
  },
  handler: async (ctx, { userid, customerid }) => {
    const user = await getUser(ctx, userid);
    if (!user) return null;

    ctx.db.patch(user._id, { customerid });
  },
});