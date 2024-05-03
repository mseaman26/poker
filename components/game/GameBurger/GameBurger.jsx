'use client'
import React, {useState} from 'react'
import styles from './GameBurger.module.css'
import { slide as Menu } from 'react-burger-menu';
import Link from "next/link"
import { right } from 'inquirer/lib/utils/readline';
import { useRouter } from "next/navigation";


const GameBurger = ({endGame}) => {

    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false)

    const closeMenu = () => {
        setMenuOpen(false)
    }

    const menuStyles = {
        // Position and sizing of burger button
        bmBurgerButton: {
            position: 'relative',
            width: '36px',
            height: '30px',
            color: 'white',
        },
        //Color/shape of burger icon bars
        bmBurgerBars: {
          
            background: '#f1f1f1'
        },
        //Color/shape of burger icon bars on hover
        bmBurgerBarsHover: {
            background: '#a90000'
        },
        //Position and sizing of clickable cross button
        bmCrossButton: {
            height: '32px',
            width: '32px'
        },
        // Color/shape of close button cross
        bmCross: {
            fontSize: '64em',
            // fontSize: "64px",
            background: '#bdc3c7'
        },
      
        //Sidebar wrapper styles
        // Note: Beware of modifying this element as it can     break the animations - you should not need to touch it in most cases
    
        bmMenuWrap: {
            position: 'fixed',
            height: '100%',
            width: '80%',
            top: 0
        },
        //General sidebar styles
        bmMenu: {
            position: 'absolute',
            background: '#333333',
            padding: '2.5em 1.5em 0',
            fontSize: '1.15em',
            width: '100%',
            top: 0
        },
        //Morph shape necessary with bubble or elastic
        bmMorphShape: {
            
        },
        //Wrapper for item list
        bmItemList: {
            color: '#F1EFEB',
            padding: '0.8em'
        },
        //Individual item
        bmItem: {
            fontWeight: 700,
            fontSize: 32,
            marginBottom: 20,
            color: '#f1f1f1'
        },
        //Styling of overlay
        bmOverlay: {
    
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }
    }
    return (
   
        <Menu className={`${styles.gameBurger}`} right isOpen={menuOpen} onClose={()=>setMenuOpen(false)} styles={menuStyles} onOpen={()=>setMenuOpen(true)}>
            <div className="menu-item"  onClick={() => {
                closeMenu()
                router.back()}}>
            Leave Game Room
            </div>
            <div className="menu-item" onClick={() => {
                closeMenu()
                endGame()
            }} style={{color: 'red'}}>End Game</div>
            {/* <Link className="menu-item" href="/createGame" onClick={closeMenu}>
            Create Game
            </Link>
            <Link className="menu-item" href="/games" onClick={closeMenu}>
            My Games
            </Link>
            <Link className="menu-item" href="/myFriends" onClick={closeMenu}>
            My Friends
            </Link>
            <Link className="menu-item" href="/searchUsers" onClick={closeMenu}>
            Search Users
            </Link>
            <Link className="menu-item" href="/account" onClick={closeMenu}>
            My Account
            </Link> */}
        </Menu>
                   
    )
}

export default GameBurger