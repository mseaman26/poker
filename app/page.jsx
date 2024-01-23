import Image from "next/image";
import styles from "./page.module.css";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";


//notice the async
export default async function Home() {
  const session = await getServerSession(options)
  return (
    <main className={styles.main}>
      {session ? (
        <h1>access granted</h1>
      ) : (
        <h1>you shall not pass</h1>
      )}
    </main>
  );
}
