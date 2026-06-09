import { connectDB } from "@/app/lib/connectDB";
import { allPullDays } from "@/app/schema/allPullDays";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        await connectDB();
        const allPullDaysDates = await allPullDays.find();
        return NextResponse.json({ message: "success", allPullDaysDates })
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: "failed to add", error })
    }
}

export async function POST(req) {
    const body = await req.json();
    try {
        await connectDB();
        const updateTheDate = await allPullDays.findByIdAndUpdate(body.id, {
            completed: true
        })
        return NextResponse.json({ message: "success", updateTheDate })
    } catch (error) {
        return NextResponse.json({ message: "error", error })
    }
}