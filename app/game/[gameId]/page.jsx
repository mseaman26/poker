import { ViewGameInfo } from "@/components/game/ViewGameInfo"

export default function({params}){
    return (
        <>
        <ViewGameInfo id={params.gameId}/>
        </>
    )
}