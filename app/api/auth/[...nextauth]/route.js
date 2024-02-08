import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

//code snippet for having activity based session behavior

// // pages/api/auth/[...nextauth].js

// import NextAuth from 'next-auth';
// import Providers from 'next-auth/providers';

// export default NextAuth({
//   providers: [
//     // Your authentication providers...
//   ],
//   callbacks: {
//     async session(session, token) {
//       // Calculate the time since the last activity
//       const lastActivity = session?.user?.lastActivity || Date.now();
//       const elapsedTime = Date.now() - lastActivity;

//       // Set a custom property in the session to track last activity
//       session.user.lastActivity = Date.now();

//       // Check if the elapsed time is less than your desired session expiration time
//       // (e.g., 30 minutes in milliseconds)
//       const sessionExpiryTime = 30 * 60 * 1000; // 30 minutes
//       const isSessionValid = elapsedTime < sessionExpiryTime;

//       if (!isSessionValid) {
//         // If the session has expired, log the user out
//         return null;
//       }

//       // If the session is still valid, return the session
//       return session;
//     },
//   },
// });
