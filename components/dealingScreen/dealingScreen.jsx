import React from 'react'
import styles from './dealingScreen.module.css'
import { motion } from 'framer-motion'
import Image from 'next/image'
import cardBack from '@/app/assets/cardSVGs/backs/red.svg'

const DealingScreen = () => {
  return (
    <div className={styles.overlay}>
      
      <div className={styles.content}>
      <h1>Dealing...</h1>
      <motion.div
       style={{ originX: 0.5, originY: 0.5 }}
       animate={{ rotate: [0, 720] }}
       transition={{
         duration: 1.5,
         ease: "easeInOut",
         repeat: Infinity,
         repeatDelay: 0.5,
       }}
      >
        <Image src={cardBack} alt="Loading..." />
      </motion.div>
      </div>
    </div>
  )
}

export default DealingScreen