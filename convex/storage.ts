import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendImage = mutation({
  args: {
    storageid: v.id("_storage"),
    userid: v.string(),
    channelid: v.id("channels"),
  },
  handler: async (ctx, { storageid, userid, channelid }) => {
    const user = await ctx.db
      .query("usersInfo")
      .withIndex("by_userid", (q) => q.eq("userid", userid))
      .unique();
    if (!user) return null;
    return ctx.db.insert("messages", {
      content: storageid,
      userid: user._id,
      channelid: channelid,
      type: "file",
    });
  },
});
