import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

let cash

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        let { email, password } = credentials;
        email = email.toLowerCase()

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
          cash = user.cash
          return { ...user.toObject(), id: user._id.toString(), cash: user.cash};
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = user?._id
        token.cash = user?.cash
      }
      return token
    },
    session({ session, token }) {
      console.log('the session: ', session)
        // I skipped the line below coz it gave me a TypeError
        // session.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.cash = cash
  
        return session;
      },
  },
  session: {
    strategy: 'jwt',
  },
  session: {
    strategy: "jwt",
    // jwt: true
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
