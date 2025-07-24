import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendSignalingMessage = mutation({
  args: {
    channelId: v.id("channels"),
    hostId: v.string(),
    type: v.union(
      v.literal("offer"),
      v.literal("answer"),
      v.literal("candidate"),
    ),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("signalingMessages")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId))
      .filter((q) => q.eq(q.field("type"), "offer"))
      .collect();
    
    if (messages.length > 1) {
      await ctx.db.patch(messages[0]._id, { ...args });
      return;
    }
    await ctx.db.insert("signalingMessages", {
      ...args,
    });
  },
});

export const getOffer = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const offer = await ctx.db
      .query("signalingMessages")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId))
      .filter((q) => q.eq(q.field("type"), "offer"))
      .first();
    return offer;
  },
});

export const getSignalingMessages = query({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const query = ctx.db
      .query("signalingMessages")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId));

    return await query.take(100);
  },
});

export const endCall = mutation({
  args: {
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("signalingMessages")
      .withIndex("by_channelId", (q) => q.eq("channelId", args.channelId))
      .collect();
    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));
  },
});
