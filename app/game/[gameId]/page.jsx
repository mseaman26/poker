import { ViewGameInfo } from "@/components/game/ViewGameInfo"

export default function({params}){
    return (
        <>
        <h1>id: {params.gameId}</h1>
        <ViewGameInfo id={params.gameId}/>
        </>
    )
}