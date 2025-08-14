import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getInfo = query({
  args: {
    serverid: v.id("servers"),
  },
  handler: async (ctx, { serverid }) => {
    const server = ctx.db.get(serverid);
    return server;
  },
});

export const getRoles = query({
  args: {
    serverid: v.id("servers"),
  },
  handler: async (ctx, { serverid }) => {
    return await ctx.db
      .query("roles")
      .withIndex("by_serverid", (q) => q.eq("serverid", serverid))
      .collect();
  },
});

export const getCategories = query({
  args: {
    serverid: v.id("servers"),
    userid: v.string(),
  },
  handler: async (ctx, { serverid, userid }) => {
    const server = await ctx.db.get(serverid);
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userid", (q) => q.eq("userid", userid))
      .first();
    if (!user) return null;
    if (!server) return null;

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_serverId", (q) => q.eq("serverid", serverid))
      .collect();

    const userRoles = await ctx.db
      .query("userRoles")
      .withIndex("by_userId_serverId", (q) =>
        q.eq("userid", user._id).eq("serverid", serverid),
      )
      .collect();

    const permissions = await Promise.all(
      userRoles.map(async (userRole) => {
        const role = await ctx.db.get(userRole.roleid);
        return role?.permissionid
          ? (await ctx.db.get(role.permissionid))?._id
          : null;
      }),
    );

    const categoriesChannels = await Promise.all(
      (categories ?? []).map(async (category) => {
        const channels = await ctx.db
          .query("channels")
          .filter((q) => q.eq(q.field("categoryid"), category._id.toString()))
          .collect();
        const sendChannels = channels.map((channel) => {
          return { name: channel.name, id: channel._id, type: channel.type };
        });

        if (
          server.ownerid !== user._id &&
          category.permissionid &&
          !permissions.includes(category.permissionid)
        )
          return null;

        return {
          ...category,
          channels: sendChannels,
        };
      }),
    );

    return categoriesChannels;
  },
});

export const create = mutation({
  args: {
    serverName: v.string(),
    userid: v.string(),
    serverIcon: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { serverIcon, serverName, userid, description }) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userid", (q) => q.eq("userid", userid))
      .unique();

    if (!user) return null;

    const server = await ctx.db.insert("servers", {
      name: serverName,
      ownerid: user._id,
      serverIcon: serverIcon,
      description: description,
    });
    await ctx.db.insert("joined", {
      userid: user._id,
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
  handler: async (ctx, { name, serverid }) => {
    return await ctx.db.insert("categories", {
      name: name,
      serverid: serverid,
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
  handler: async (ctx, { serverid, categoryid, name, type }) => {
    return ctx.db.insert("channels", {
      serverid: serverid,
      categoryid: categoryid,
      name: name,
      type: type,
    });
  },
});

export const joinServer = mutation({
  args: {
    userid: v.string(),
    serverid: v.id("servers"),
  },
  handler: async (ctx, { userid, serverid }) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userid", (q) => q.eq("userid", userid))
      .unique();
    if (!user) return null;

    const joinedServers = await ctx.db
      .query("joined")
      .withIndex("by_userid_serverid", (q) =>
        q.eq("serverid", serverid).eq("userid", user._id),
      )
      .collect();

    if (joinedServers.length > 0) {
      return null;
    }

    return await ctx.db.insert("joined", {
      userid: user._id,
      serverid: serverid,
    });
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
  handler: async (ctx, { name, permission, serverid }) => {
    const permissionid = await ctx.db.insert("permissions", permission);
    return await ctx.db.insert("roles", {
      name: name,
      permissionid,
      serverid: serverid,
      color: "",
    });
  },
});

export const editInfo = mutation({
  args: {
    serverid: v.id("servers"),
    servername: v.string(),
  },
  handler: async (ctx, { servername, serverid }) => {
    await ctx.db.patch(serverid, { name: servername });
  },
});

export const getMembers = query({
  args: {
    serverid: v.id("servers"),
  },
  handler: async (ctx, { serverid }) => {
    const members = await ctx.db
      .query("joined")
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

// Remove if not used
export const getChannels = query({
  args: {
    id: v.id("servers"),
  },
  handler: async (ctx, args) => {
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_serverid", (q) => q.eq("serverid", args.id))
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
      .withIndex("by_categoryid", (q) => q.eq("categoryid", args.id))
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
