import mongoose, { Schema } from "mongoose"

const addAdvancedExercise = new Schema({
    series:{
        type:String,
        enum:["push","pull","leg"],
        required:true
    },
    exerciseName: {
        type: String,
        required: true
    },
    exerciseType:{
        type: String,
        enum:["reps","time"],
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    targetRep: {
        type: Number,
        required: true
    }
});

export const advancedExercise = mongoose.models.AdvancedExercise || mongoose.model("AdvancedExercise", addAdvancedExercise);