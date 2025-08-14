import { v } from "convex/values";
import { query } from "./_generated/server";

export const getInfo = query({
  args: {
    channelid: v.id("channels"),
  },
  handler: async (ctx, { channelid }) => {
    return await ctx.db.get(channelid);
  },
});
