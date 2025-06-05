"server only";

// import { query } from "./_generated/server";
// import { v } from "convex/values";

// export const loginUser = query({
//   args: {
//     email: v.string(),
//     password: v.string()
//   },
//   handler: async(ctx, args) {
//     const user = await ctx.db.query("users").filter(q => q.eq(q.field("email"), args.email)).take(1);
      
//     return false;
//       // if(user.email && user.password) {
//       //   return true;
//       // }
//       // r
//   }
// })