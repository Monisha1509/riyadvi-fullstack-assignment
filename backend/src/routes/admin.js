import { Router } from 'express';
import Lead from '../models/Lead.js';
const router=Router();
import { requireAdmin } from '../middleware/auth.js';
// Protect these endpoints with real authentication before production deployment.
router.get('/summary', requireAdmin, async (req, res, next) => {try{const [total,byType,recent]=await Promise.all([Lead.countDocuments(),Lead.aggregate([{$group:{_id:'$type',count:{$sum:1}}}]),Lead.find().sort({createdAt:-1}).limit(100).select('type name email phone company requirement status createdAt').lean()]);res.json({total,byType:byType.reduce((a,x)=>(a[x._id]=x.count,a),{}),recent});}catch(err){next(err);}});
export default router;
