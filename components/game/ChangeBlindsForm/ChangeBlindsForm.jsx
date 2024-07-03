"use client";
import styles from './ChangeBlindsForm.module.css'
import { useState } from 'react'


const ChangeBlindsForm = () => {

    const [newBigBlind, setNewBigBlind] = useState(null)

    


    return (
        <div className={styles.container}>
            <form>
                <label>Big Blind</label>
                <input type="number" value={bigBlind} onChange={(e) => setNewBigBlind(e.target.value)} />
            
            </form>
        </div>
    )
}