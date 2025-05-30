const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('preLogin/home');
});
router.get('/429Error',(req,res,next)=>{
    return res.status(429).render('429Page');
})

module.exports = router;