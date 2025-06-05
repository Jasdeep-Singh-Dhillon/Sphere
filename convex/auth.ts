import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { DataModel } from "./_generated/dataModel";
import { ConvexError } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub, Google, Password, Password<DataModel>({
    id: "password-custom",
    validatePasswordRequirements: function(password:string) {
      if(!password || 
        password.length < 6 || 
        !/\d/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[A-z]/.test(password)) {
          throw new ConvexError("INVALID_PASSWORD")
        }
    }
  })],
});
