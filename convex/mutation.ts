"server only";

import { mutation } from "./_generated/server"
import { v } from "convex/values";

export const registerUser = mutation({
  args: {
    username: v.string(),
    displayName: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async function(ctx, args){
    await ctx.db.insert("users", {
      username: args.username,
      displayName: args.displayName,
      email: args.email,
      password: args.password,
    })
  }
});
