'use client'
import React from 'react'
import styles from './myFriends.module.css'
import { useSession } from 'next-auth/react'

const MyFriends = () => {

  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <div className={styles.friendRequests}>
      
      </div>
      <div className={styles.friends}>

      </div>
    </div>
  )
}

export default MyFriends