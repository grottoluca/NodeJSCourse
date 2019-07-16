const path = require('path');
const express = require('express');
const router = express.Router();
const rootDir = require('../util/path');

router.get('/', (req, res, next) => {
    console.log('In the middleware')
    res.sendFile(path.join(rootDir, 'view' , 'shop.html'));
});

module.exports = router;