import mongoose, { Schema } from "mongoose"

const addExerciseSchema = new Schema({
    series:{
        type:String,
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

export const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", addExerciseSchema);