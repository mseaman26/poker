
import { ViewUserInfo } from "@/components/viewUserInfo"

export default function ViewUserPage  ({params})  {
    console.log('user id: ', params.id)
    const userId = params.id
    return (
        <>
        <h1>single user page</h1>
        <ViewUserInfo id={userId}/>
        </>
    )
}