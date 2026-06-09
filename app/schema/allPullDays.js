import mongoose, { Schema } from "mongoose";

const allPullDaysSchema = new Schema({
    day:{
        type:Number,
        required:true
    },
    completed:{
        type:Boolean,
        required:true
    },
    series:{
        type:String,
        enum:["push","pull","leg"],
        required:true
    },
    level:{
        type:String,
        enum:["beginner","intermediate","advanced"],
        required:true
    }
})

export const allPullDays = mongoose.models.allPullDays || mongoose.model("allPullDays", allPullDaysSchema);
