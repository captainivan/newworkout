import { connectDB } from "@/app/lib/connectDB";
import { advancedExercise } from "@/app/schema/addAdvancedExercise";
import { Exercise } from "@/app/schema/addExercise";
import { intermediateExercise } from "@/app/schema/addIntermediateExercise";
import { NextResponse } from "next/server";



export async function POST(req) {
   const { level } = await req.json();
   try {

      if (level === "beginner") {
         await connectDB();
         const getExercises = await Exercise.find({});
         return NextResponse.json({ message: "beginner", getExercises })
      }
      if (level === "intermediate") {
         await connectDB();
         const getExercises = await intermediateExercise.find({});
         return NextResponse.json({ message: "beginner", getExercises })
      }
      if (level === "advanced") {
         await connectDB();
         const getExercises = await advancedExercise.find({});
         return NextResponse.json({ message: "beginner", getExercises })
      } else {
         return NextResponse.json({ message: "something failed", level })
      }
   } catch (error) {
      return NextResponse.json({ message: "error", error })
   }
}