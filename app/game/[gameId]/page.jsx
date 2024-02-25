'use client'
import { ViewGameInfo } from "@/components/game/ViewGameInfo"
import { useRouter } from "next/navigation"

export default function({params}){
    const router = useRouter()
    if(!params.gameId){
        router.push('/dashboard')
    }
    return (
        <>
        <ViewGameInfo id={params.gameId}/>
        </>
    )
}