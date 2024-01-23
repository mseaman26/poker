// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { MongoClient } from 'mongodb';

export default NextAuth({
  providers: [
    Providers.Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
          await client.connect();
          const db = client.db();
          const user = await db.collection('users').findOne({ email: credentials.email, password: credentials.password });

          if (user) {
            return Promise.resolve(user);
          } else {
            return Promise.resolve(null);
          }
        } finally {
          await client.close();
        }
      },
    }),
  ],
  session: {
    jwt: true,
  },
});
