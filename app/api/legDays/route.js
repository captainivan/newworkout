import { connectDB } from "@/app/lib/connectDB";
import { allLegDays } from "@/app/schema/allLegDays";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        await connectDB();
        const allLegDaysDates = await allLegDays.find();
        return NextResponse.json({ message: "success", allLegDaysDates })
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ message: "failed to add", error })
    }
}

export async function POST(req) {
    const body = await req.json();
    try {
        await connectDB();
        const updateTheDate = await allLegDays.findByIdAndUpdate(body.id, {
            completed: true
        })
        return NextResponse.json({ message: "success", updateTheDate })
    } catch (error) {
        return NextResponse.json({ message: "error", error })
    }
}