import React from 'react'
import styles from './loadingScreen.module.css'
import cardBack from '@/app/assets/cardSVGs/backs/red.svg'
import Image from 'next/image'
import {motion} from 'framer-motion'

const spinAnimation = {
  rotate: [0, 720], // Spin twice (360 * 2 = 720)
  transition: {
    duration: 1,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 0.5, // Delay between spins
  },
};

const LoadingScreen = () => {
  return (
    <div className={styles.overlay}>
      
      <div className={styles.content}>
      <h1>Loading...</h1>
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

export default LoadingScreen