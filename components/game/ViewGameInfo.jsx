'use client'
import { getGameAPI } from "@/lib/apiHelpers"
import { useEffect, useState } from "react"

export const ViewGameInfo = ({id}) => {
    const [gameInfo, setGameInfo] = useState({})

    const getGameInfo = async (gameId) => {
        if(gameId){
            const data = await getGameAPI(gameId)
            console.log('game data: ', data)
            setGameInfo(data)
        }
    }

    useEffect(() => {
        getGameInfo(id)
    }, [])
    useEffect(() => {
        console.log(gameInfo)
    }, [setGameInfo])

    return(
        <h1>Game Name: {gameInfo.name}</h1>
    )
}