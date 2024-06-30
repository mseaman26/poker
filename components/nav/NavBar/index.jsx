'use client'
import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import styles from './NavBar.module.css'
import Link from "next/link"
import { useSession } from "next-auth/react"
import { slide as Menu } from 'react-burger-menu';
import EmptyProfileIcon from "@/app/assets/icons/emptyProfileIcon"
import { fetchSingleUserAPI } from '@/lib/apiHelpers'

export default function NavBar () {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false)
    const [meData, setMeData] = useState({})
    const [windowWidth, setWindowWidth] = useState(0);
    const showMenu = windowWidth < 992;

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
          fill: '#373a47'
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
          border: '1px solid #f1f1f1',
          color: '#f1f1f1',
          padding: 10
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

    const closeMenu = () => {
        setMenuOpen(false)
    }


    useEffect(() => {
        function handleResize() {
          setWindowWidth(window.innerWidth);
        }
        if(window){
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
        
    }, []);
    useEffect(() => {
      console.log('medata', meData)
    }, [meData])
    useEffect(() => {
      if(session){
        fetchSingleUserAPI(session.user.id).then((res) => {
            setMeData(res)
        })
      }
      console.log('session', session)
    }, [session])



    return(
        <>
        {!session ?
            <div className={styles.loggedOutNav}>
                <Link href={'/dashboard'}><h1>Mike's Friendly Poker</h1></Link>
            </div>
            :
            <>
              <div className={styles.container} >
              <Link href={'/dashboard'}><h1>Mike's Friendly Poker</h1></Link>
  
                  <>

                  {showMenu ? (
                      
                      <Menu className={`${styles.burgerMenu}`} right isOpen={menuOpen} onClose={()=>setMenuOpen(false)} styles={menuStyles} onOpen={()=>setMenuOpen(true)}>
                          <Link className="menu-item" href="/" onClick={closeMenu}>
                          Home
                          </Link>
                          <Link className="menu-item" href="/createGame" onClick={closeMenu}>
                          Create Game
                          </Link>
                          <Link className="menu-item" href="/games" onClick={closeMenu}>
                          My Games
                          </Link>
                          <Link className="menu-item" href="/myFriends" onClick={closeMenu}>
                          My Friends
                          </Link>
                          <Link className="menu-item" href="/searchUsers" onClick={closeMenu}>
                          Add Friends
                          </Link>
                          <Link className="menu-item" href="/account" onClick={closeMenu}>
                          My Account
                          </Link>
                          <div className={`menu-item ${styles.burgerLogout}`}  onClick={signOut}>Log Out</div>
                      </Menu>
                      
                      ) : (
                      <>
                          <Link className='icon_link' href='/createGame'>
                              Create Game
                          </Link>
                          <Link className='icon_link' href='/games'>
                              My Games
                          </Link>
                          <Link className='icon_link' href='/myFriends'>
                              My Friends
                          </Link>
                          <Link className='icon_link' href='/searchUsers'>
                              Add Friends
                          </Link>
                          <Link className='icon_link' href='/account'>
                              Account
                          </Link>
                          <button onClick={signOut} className="cancelButton">Log Out</button>
                      </>
                  )}
                  </>

              </div>
              <div className={styles.nav2}>
                  
                <Link href={'/account'}>
                    <div className={styles.navProfilePicAndName}>
                      <EmptyProfileIcon width='20px' height='20px' className={styles.navProfilePic} />
                      {/* <Image src={emptyProfile} width={15} height={15} className={styles.navProfilePic} alt='empty profile'></Image> */}
                      <p style={{display: 'inline'}}>{session.user.name} </p>
                    </div>
                    
                </Link>
                {/* {meData?.cash !== undefined && <p>{`Cash: $${(meData?.cash / 100).toFixed(2)}`}</p>} */}
              </div>
            </>
        }
        
        </>
    )
}