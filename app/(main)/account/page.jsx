'use client'
import React from 'react'
import styles from './accountPage.module.css'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { searchUsersAPI, updateUserAPI, deleteUserAPI, fetchSingleUserAPI } from '@/lib/apiHelpers'
import { signIn, signOut } from 'next-auth/react'
import LoadingScreen from '@/components/loadingScreen/LoadingScreen2'


const AccountPAge= () => {

    const { data: session } = useSession();
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newCashBalance, setNewCashBalance] = useState('')
    const [password2, setPassword2] = useState('')
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [usernameAvailable, setUsernameAvailable] = useState(false)
    const [emailAvailable, setEmailAvailable] = useState(false)
    const [loading, setLoading] = useState(true);
    const [meData, setMeData] = useState({})
    const production = process.env.NODE_ENV === 'production'

    const handleNameChange = async () => {
        setError('')
        if(newUsername){
            const data = await searchUsersAPI(newUsername)
            for(let user of data){
                if(user.name === newUsername){
                    setUsernameAvailable(false)
                    return
                }
            }
            setUsernameAvailable(true)
        }
    }
    const handleEmailChange = async () => {
        setEmailError('')
        if(newEmail){
            const data = await searchUsersAPI(newEmail)
            for(let user of data){
                if(user.email === newEmail){
                    setEmailAvailable(false)
                    return
                }
            }
            setEmailAvailable(true)
        }
    }

    const updateUsername = async (e) => {
        e.preventDefault()
        try{
            if(usernameAvailable){
                const data = {name: newUsername}
                const res = await signIn("credentials", {
                    email: session.user.email,
                    password,
                    redirect: false,
                    onSuccess: async () => {
                    }

                });
                if (res.error) {
                    setNameError("Invalid Credentials");
                    return;
                }
                const updatedUser = await updateUserAPI(session.user.id, data)
                setNewUsername('')
                const res2 = await signIn("credentials", {
                    email: session.user.email,
                    password,
                    redirect: false,
                    onSuccess: async () => {
                        if(!production)console.log('login success while already logged in')
                    }

                });
            }
        }catch(err){
            if(!production)console.log('error in update username: ', err)
        }
        
    }

    const updateEmail = async (e) => {
        e.preventDefault()
        try{
            if(emailAvailable){
                const data = {email: newEmail}
                const res = await signIn("credentials", {
                    email: session.user.email,
                    password,
                    redirect: false,
                    onSuccess: async () => {
                    }

                });
                if (res.error) {
                    setEmailError("Invalid Credentials");
                    return;
                }
                const updatedUser = await updateUserAPI(session.user.id, data)
                setNewEmail('')
                const res2 = await signIn("credentials", {
                    email: newEmail,
                    password,
                    redirect: false,
                    onSuccess: async () => {

                    }

                });
            }
        }catch(err){
            if(!production)console.log('error in update email: ', err)
        }
    }

    const deleteAccount = async () => {
        if(!confirm('Are you sure you want to delete your account?'))return
        try{
            const deletedUser = await deleteUserAPI(session.user.id)
            await signOut()
        }catch(err){
            if(!production)console.log('error in delete account: ', err)
        }
    }
    const getMeData = async () => {
        const me = await fetchSingleUserAPI(session.user.id)
        setMeData(me)
    
    }
    const handleCashSubmit = async (e) => {
        e.preventDefault()
        try{
            const data = {cash: newCashBalance * 100}
            await updateUserAPI(session.user.id, data)
            getMeData()
            setNewCashBalance('')
        }catch(err){
            if(!production)console.log('error in update cash: ', err)
        }
    
    }
    useEffect(() => {
        handleNameChange()
    }, [newUsername])
    useEffect(() => {
        handleEmailChange()
    }, [newEmail])

    useEffect(() => {
            if(session){
                setLoading(false)
                getMeData()
            }
            
    }, [session])

    return (
        <>
        {loading && <LoadingScreen />}
        <div className='headerContainer'>
            <h1>Edit My Account</h1>
        </div>
            
            {meData && <div className='formContainer'>
                {meData?.cash !== undefined && <div className='formContainer'>
                    <form className='form' onSubmit={handleCashSubmit}>
                        {/* <label className='formLabel'>{`Update your cash balance: (currently $${(meData?.cash / 100).toFixed(2)})`}</label> */}
                        <label className='formLabel'>{`Update your cash balance: (coming soon)`}</label>
                        <div style={{display: 'flex', width: '100%', alignItems: 'center', marginBottom: 12}}>
                            $ <input type='number' inputMode='decimal' className={`input ${styles.cashInput}`} onChange={(e) => setNewCashBalance(e.target.value)} value={`${newCashBalance}`}></input>
                        </div>
                        <button className='submitButton submitButtonSmall' type='submit'>Submit</button>
                    </form>
                </div>}
                <form className='form' onSubmit={(e) => updateUsername(e)}>
                    {session?.user?.name && <label className='formLabel'>{`Update Username (currently: ${session?.user?.name})`}</label>}
                    <h1>{newUsername ? (usernameAvailable ? <span style={{color: 'green'}}>username is available!</span>: <span style={{color: 'red'}}>username not available</span>) : ''}</h1>
                    <input
                        onChange={(e) => setNewUsername(e.target.value.toLocaleLowerCase())}
                        type="text"
                        className='input'
                        placeholder='Enter new username'
                    />
                    <label className='formLabel'>{`enter password to update username`}</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className='input'
                    />
                    <div className='errorMessage'>{nameError}</div>
                    <button className='submitButton submitButtonSmall' type='submit'>Submit</button>
                    
                </form>
                <form className='form' onSubmit={(e) => updateEmail(e)}>
                    <label className='formLabel'>{`Update Email (currently: ${session?.user?.email})`}</label>
                    <h1>{newEmail ? (emailAvailable ? <span style={{color: 'green'}}>email is available!</span>: <span style={{color: 'red'}}>email not available</span>) : ''}</h1>
                    <input
                        onChange={(e) => setNewEmail(e.target.value.toLocaleLowerCase())}
                        type="email"
                        className='input'
                        placeholder='Enter new email'
                    />
                    <label className='formLabel'>{`enter password to update email`}</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className='input'
                    />
                    <div className='errorMessage'>{emailError}</div>
                    <button className='submitButton submitButtonSmall' type='submit'>Submit</button>
                    
                </form>
                <button className='cancelButton' onClick={deleteAccount}>Delete Account</button>
            </div>}
        </>
    )
}

export default AccountPAge
