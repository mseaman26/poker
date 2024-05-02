import React from 'react'
import styles from './BetForm.module.css'

const BetForm = ({handleBetChange, handleBetSubmit, maxBet, setBetFormShown }) => {
  return (
    <div className={`${styles.overlay}`}>
        <div className={`${styles.formContainer}`}>
            <button onClick={() => setBetFormShown(false)} className={`cancelButton ${styles.cancelBet}`}>Cancel</button>
        </div>
        

    </div>
  )
}

export default BetForm