import userModel from "@/modules/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authoptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  call: {
    async signIn({ user, account, profile }) {
      // profile.sub = google unique id
      // user.email = google email
      // user.name = google name

      const existingUser = await userModel.findOne({ email: user.email });

      if (!existingUser) {
        // create Google user
        await userModel.create({
          Username: user.name,
          email: user.email,
          provider: "google",
          providerId: profile.sub,
          // no password field for google!
        });
      }

      return true;
    },

    async session({ session, token }) {
      return session;
    },
  },
});
export { authoptions as GET, authoptions as POST };
