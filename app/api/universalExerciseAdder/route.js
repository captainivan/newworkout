import { connectDB } from "@/app/lib/connectDB";
import { advancedExercise } from "@/app/schema/addAdvancedExercise";
import { intermediateExercise } from "@/app/schema/addIntermediateExercise";
import { allLegDays } from "@/app/schema/allLegDays";
import { allPullDays } from "@/app/schema/allPullDays";
import { allPushDays } from "@/app/schema/allPushDays";
import { NextResponse } from "next/server";




export async function POST(req) {
    try {
        return NextResponse.json({ message: "success" })
    } catch (error) {
        return NextResponse.json({ message: "error", error })
    }
}

export async function GET(req) {
    try {
        await connectDB();
        const getExercise = await allPushDays.findByIdAndUpdate("6a23acd7261ac528ad9ce725",{
            completed:false
        });
        return NextResponse.json({ message: "success", getExercise })
    } catch (error) {
        return NextResponse.json({ message: "error", error })
    }
}