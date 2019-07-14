const express = require('express');
const bodyParser = require('body-parser');
const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');

const app = express();
app.use(bodyParser.urlencoded());

app.use(adminRoute);
app.use(shopRoute);


app.listen(3000);
