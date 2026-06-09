import mongoose, { Schema } from "mongoose";

const allLegDaysSchema = new Schema({
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

export const allLegDays = mongoose.models.allLegDays || mongoose.model("allLegDays", allLegDaysSchema);
