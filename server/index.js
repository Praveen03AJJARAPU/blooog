const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const authRoute = require('./Routes/auth');
const blogRoute = require('./Routes/blogRoute')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const User = require('./Models/user');
const cookieSession = require('cookie-session');
require('dotenv').config();

const app = express();
const mongoURL = process.env.MONGO_URL;
const {Server} = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

app.use(session({
  secret: 'asp',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,  
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

mongoose.connect(mongoURL)
.then(() => console.log('connected'))
  .catch((err) => console.log(err));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails ? profile.emails[0].value : null,
        profile_picture: profile.photos[0].value,
      });
    }
    // console.log(user);
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



io.on('connection', (socket) => {
  console.log("new client connected");
 
  socket.on('newComment', (comment) => {
    io.emit('commentAdded', comment);
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })

})



app.use('/auth', authRoute);
app.use('/blog', blogRoute);

server.listen(process.env.PORT || 5000, () => console.log('running'));
