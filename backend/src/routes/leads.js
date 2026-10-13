import { Router } from 'express';
import Lead from '../models/Lead.js';
import { validateLead } from '../middleware/validateLead.js';
const router=Router();
const allowed={contact:['name','email','phone','company','requirement','message'],consultation:['name','email','phone','company','message'], 'health-checkup':['name','email','phone','company','website','websiteStatus','marketing','technology','challenges','desiredOutcome'], 'lead-magnet':['name','email','phone','company'], applications:['name','email','phone','position','resumeUrl','message']};
for(const [type,fields] of Object.entries(allowed)){
 router.post(`/${type}`,validateLead,async(req,res,next)=>{try{const data={};for(const key of fields)if(req.body[key]!==undefined)data[key]=String(req.body[key]).trim();const lead=await Lead.create({type,name:data.name,email:data.email,phone:data.phone,company:data.company,requirement:data.requirement,message:data.message,data});res.status(201).json({message:'Submission received successfully.',id:lead._id});}catch(err){next(err);}});
}
export default router;
