const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateLead(req,res,next){
 const {name,email}=req.body||{};
 if(typeof name!=='string'||name.trim().length<2||name.trim().length>120) return res.status(400).json({message:'Please provide a name between 2 and 120 characters.'});
 if(typeof email!=='string'||email.length>254||!EMAIL.test(email.trim())) return res.status(400).json({message:'Please provide a valid email address.'});
 for(const [key,value] of Object.entries(req.body)){if(typeof value==='string'&&value.length>5000)return res.status(400).json({message:`${key} is too long.`});}
 next();
}
