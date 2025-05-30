const rateLimit = require('express-rate-limit');
const fileConstants = require('../FileConstants');
const limiter = (rate,refreshTime) => rateLimit({
    windowMs: refreshTime==null ? fileConstants.API_RATE_LIMIT_REFRESH_TIME : refreshTime, // 1 minute window
    max: rate==null ? fileConstants.API_RATE_LIMIT : rate, // Allow only 10 requests per IP
    standardHeaders: true, // Add RateLimit headers in the response
    legacyHeaders: false, // Disable X-RateLimit-* headers
    handler: (req, res) => {
        res.status(429).render('429Page');
    },
});

module.exports = limiter;
