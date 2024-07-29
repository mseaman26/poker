//delete all user whose name is test1, test2, test3, test4, test5, test6, test7, or test8
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function DELETE(req, res) {
    try {
        await connectMongoDB();
        const users = await User.deleteMany({
        name: { $in: ["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9", "test10", "test11", "test12", "test13", "test14", "test15", "test16"] },
        });
        return NextResponse.json(users);
    } catch (err) {
        console.log("error in delete users: ", err);
    }
}