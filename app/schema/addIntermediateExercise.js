import mongoose, { Schema } from "mongoose"

const addIntermediateExerciseSchema = new Schema({
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

export const intermediateExercise = mongoose.models.IntermediateExercise || mongoose.model("IntermediateExercise", addIntermediateExerciseSchema);