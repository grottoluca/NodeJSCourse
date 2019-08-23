const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const crypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'token.json'
);
let rawApiData = fs.readFileSync(p);
let API = JSON.parse(rawApiData);

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: API.sendGrid_API
  }
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect('login');
      }
      crypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.')
          res.redirect('login');
        }).catch(err => {
          res.redirect('login');
        })
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'Email already exist.')
        return res.redirect('/signup');
      }
      return crypt.hash(password, 12)
        .then(hashedPassoword => {
          const user = new User({
            email: email,
            password: hashedPassoword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('login');
          return transporter.sendMail({
            to: email,
            from: 'shop@node.com',
            subject: 'Registration succeded',
            html: '<h1>You successfully sign up!</h1>'
          });
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    });

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Passowrd',
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that mail found!');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'shop@node.com',
          subject: 'Password Reset',
          html: `
        <p>You request a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
        `
        });
      })
      .catch(err => {
        console.log(err);
      })
  })
}