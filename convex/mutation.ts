"server only";

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const registerUser = mutation({
  args: {
    username: v.string(),
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async function (ctx, args) {
    const userByEmail = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();
    const userByName = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), args.username))
      .unique();
    if (userByEmail || userByName) {
      return false;
    }
    await ctx.db.insert("users", {
      name: args.name,
      username: args.username,
      email: args.email,
      password: args.password,
    });
    return true;
  },
});
