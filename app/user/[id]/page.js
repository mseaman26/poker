export default function UserPage  (id)  {
    console.log('user id: ',id.params.id)
    const userId = id.params.id
    return (
        <h1>{userId}</h1>
    )
}