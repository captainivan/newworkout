import mongoose, { Schema } from "mongoose";

const allPushDaysSchema = new Schema({
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

export const allPushDays = mongoose.models.allPushDays || mongoose.model("allPushDays", allPushDaysSchema);
