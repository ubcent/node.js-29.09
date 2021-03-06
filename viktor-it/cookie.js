const request = require('request');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');

const app = express();
app.use(cookieParser());
app.use(session({ keys: ['secret'] }));

app.use((req, res) => {
  let n = req.session.views || 0;
  req.session.views = ++n;

  res.send(`${n} views sessionID`);
});

app.listen(8000);