import mongoose from 'mongoose';
const leadSchema = new mongoose.Schema({
 type:{type:String,required:true,enum:['contact','consultation','health-checkup','lead-magnet','applications']},
 name:{type:String,required:true,trim:true,maxlength:120},email:{type:String,required:true,trim:true,lowercase:true,maxlength:254},
 phone:{type:String,trim:true,maxlength:30},company:{type:String,trim:true,maxlength:160},requirement:{type:String,trim:true,maxlength:160},
 message:{type:String,trim:true,maxlength:5000},status:{type:String,enum:['new','in-progress','closed'],default:'new'},data:{type:mongoose.Schema.Types.Mixed,default:{} }
},{timestamps:true});
leadSchema.index({type:1,createdAt:-1});
export default mongoose.model('Lead',leadSchema);
