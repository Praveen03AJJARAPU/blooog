const router = require('express').Router();
const passport = require('passport');
const randomstring = require('randomstring');
const Otps = require('../Models/otps');
const User = require('../Models/user');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const upload = require('./multer');

require('dotenv').config();
var otps = [];
 
router.get('/login/failed', (req, res) => {
  const message = req.query.message || 'Login failed';

  res.status(401).json({
    success: false,
    message: message
  });
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if(err) {
      return next(err);
    }
    req.session = null;
    res.redirect(`${process.env.CLIENT_URL}/login`);
  })
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["openid", "email", "profile"] })
);

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) { 
        console.log('Error during authentication:', err);
        return res.redirect(`/login/failed?message=${encodeURIComponent(err.message)}`);
      }
      if (!user) {
        const errorMessage = info ? info.message : 'Authentication failed';
        return res.redirect(`/login/failed?message=${encodeURIComponent(errorMessage)}`);
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.log('Error during login:', err); 
          return res.redirect(`/login/failed?message=${encodeURIComponent(err.message)}`);
        }

        res.redirect(process.env.CLIENT_URL);
      });
    })(req, res, next);
  });

router.get('/status', (req, res) => {
  // if()
  if(req.isAuthenticated()) {
    res.json({
      loggedIn: true, user: req.user,
    })
  } else {
    res.json({
      loggedIn: false, user: req.user,
    })
  }
})

const sendMail = async(opt) => {
  const transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      secure: true,
      secureConnection: false,
      auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
      },
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to: opt.to,
    subject: opt.subject,
    html: opt.message,
  }

  await transporter.sendMail(mailOptions);
}

router.post('/register', async(req, res) => {
  try {
    const {email, password} = req.body;
    console.log(email, password)
    const user = await User.findOne({email});
    if(!user) {
      return res.status(404).json({message: 'User not found'});
    }

    if(user.password !== password) {
      return res.status(400).json({message: 'Passport not matched'});
    }

    req.logIn(user, (err) => {
      if(err) return res.status(500).json({error: 'Login error'});
      return res.status(200).json({success: true,message: 'OTP verification successfull', user: user, redirect: '/'})
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Internal server error'})
  }
})

router.post('/sendOTP', async(req, res, next) => {
  try {
    const {email} = req.body;
    
    const exUser = await User.findOne({email});
    if(exUser) {
      return res.status(400).json({message: 'User already exists'});
    } 
    const otp = randomstring.generate({length: 6, charset: 'numeric'});
    const newOTP = new Otps({email, otp});
    
    await newOTP.save(); 
    await sendMail({
      to: email,
      subject: 'Your otp',
      message: `<p>Your verification otp is <strong>${otp}</strong></p>`
    })
    res.status(200).json({success: true, message: 'Otp sent successfully', otp});
  } catch (error) {
    console.log(error);
    res.status(500).json({success: true, error: 'Internal server error'})
  }
})

router.post('/verifyOTP',async(req, res) => {
  try { 
    const {email, otp, name, password, image} = req.body;
    console.log(req.body); 
    const exOtp = await Otps.findOneAndDelete({email, otp});
    var exUser = await User.findOne({email});
    console.log(image);   
    if(!exOtp) {
      res.status(400).json({meassage: 'Check your otp!!!'});
    }
    const _id = uuidv4();
      if (!exUser) {
        exUser = await User.create({
          googleId: _id,
          name,
          email,
          password,
          profile_picture: image,
          cover_picture: image, 
        });
      }
      req.logIn(exUser, (err) => {
        if(err) return res.status(500).json({error: 'Login error'});
        return res.status(200).json({success: true,message: 'OTP verification successfull', user: exUser, redirect: '/'})
      })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal server error'});
  }
})




module.exports = router;
