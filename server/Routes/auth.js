const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['openid', 'email', 'profile'] }));

 
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure"
  });
});

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) { 
        // console.error('Authentication Error:', err);
        return res.redirect('/login/failed');
      }
      if (!user) {
        // console.error('No user found:', info);
        return res.redirect('/login/failed');
      }
      
      req.logIn(user, (err) => {
        if (err) {
          // console.error('Login Error:', err);
          return res.redirect('/login/failed');
        } 
        // console.log('User authenticated and logged in:', user);
        // console.log(req.isAuthenticated());
        // console.log('Session:', req.session);
        res.redirect(process.env.CLIENT_URL);
      });
    })(req, res, next);
  });

router.get('/status', (req, res) => {
  // console.log('Session:', req.session);
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
  
  

module.exports = router;
