const express = require('express');
const router = express.Router();

router.get('/429Error',(req,res,next)=>{
    return res.status(429).render('429Page');
})
router.get('/',(req,res,next)=>{
    res.render('preLogin/home',{
        isLoggedIn: req?.session?.isLoggedIn,
        landedPage:'customerHomePage',
    });
});

module.exports = router;