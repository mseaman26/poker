import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req, {params}){
    const searchTerm = params.searchTerm
    // try{
    //     await connectMongoDB()
    //     const users = await User.find({
    //         $or: [
    //             {name: {
    //                 $regex: searchTerm, $options: 'i'}},
    //             {email: {
    //                 $regex: searchTerm,
    //                 $options: 'i'
    //             }}
    //         ]
    //     })
    //     return NextResponse.json(users, {status: 200})
    // }catch(err){
    //     console.log('error searching users: ', err)
    //     return NextResponse.json({
    //         message: 'error searching users',
    //         code: err.code
    //     })
    // }
    try{
        console.log("Dynamic route hit!");
        
        console.log('searchTerm: ', searchTerm)
        await connectMongoDB()
        const users = await User.find({
            $or: [
                {name: {
                    $regex: searchTerm, $options: 'i'}},
                {email: {
                    $regex: searchTerm,
                    $options: 'i'
                }}
            ]
        })
        return NextResponse.json(users, {status: 200})
    }catch(err){
        console.log('err: ', err)
    }
    
    return NextResponse.json({ message: 'hello' });
    
}