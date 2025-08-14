import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {
    channelid: v.id("channels"),
  },
  handler: async (ctx, { channelid }) => {
    let messages = await ctx.db
      .query("messages")
      .withIndex("by_channelId", (q) => q.eq("channelid", channelid))
      .order("desc")
      .collect();
    messages = messages.sort((a, b) => a._creationTime - b._creationTime);
    const result = await Promise.all(
      (messages ?? []).map(async (message) => {
        const user = await ctx.db.get(message.userid);
        if (!user) return null;
        return {
          username: user.username,
          image: user.image,
          userid: user.userid,
          id: message._id,
          content:
            message.type === "file"
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

export const remove = mutation({
  args: {
    messageid: v.id("messages"),
    userid: v.string(),
  },
  handler: async (ctx, { messageid, userid }) => {
    const message = await ctx.db.get(messageid);
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userid", (q) => q.eq("userid", userid))
      .unique();
    if (!message) return null;
    if (!user) return null;
    if (message.type === "file")
      await ctx.storage.delete(message.content as Id<"_storage">);
    return message.userid === user._id ? await ctx.db.delete(messageid) : null;
  },
});

export const send = mutation({
  args: {
    channelid: v.id("channels"),
    content: v.string(),
    userid: v.string(),
  },
  handler: async (ctx, { channelid, content, userid }) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userid", (q) => q.eq("userid", userid))
      .unique();
    if (!user) return null;
    return ctx.db.insert("messages", {
      channelid: channelid,
      content: content,
      userid: user._id,
    });
  },
});

export const edit = mutation({
  args: {
    messageid: v.id("messages"),
    userid: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { userid, messageid, content }) => {
    if (content.trim().length <= 0) return null;
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userid", (q) => q.eq("userid", userid))
      .unique();
    if (!user) return null;

    const message = await ctx.db.get(messageid);
    if (message?.userid === user._id) {
      await ctx.db.patch(messageid, { content: content });
      return true;
    }
    return null;
  },
});
