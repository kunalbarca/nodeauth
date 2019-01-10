const express = require('express'),
    router = express.Router();

//Get Homepage
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;