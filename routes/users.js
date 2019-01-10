const express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

//Register
router.get('/register', (req, res) => {
    res.render('register');
});

//Login
router.get('/login', (req, res) => {
    res.render('login');
});

//Logout
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/users/login');
});

//User Dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
});

//Register User
router.post('/register', (req, res) => {
    const name = req.body.name,
        email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        password2 = req.body.password2;

    //Validation
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email is not valid.').isEmail();
    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password', 'Password do not match.').equals(req.body.password);

    const errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        const newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        })

        User.createUser(newUser, (err, user) => {
            if (!err) {
                req.flash('success_msg', 'You are successfully registered!!! Login Now.');
                res.redirect('/users/login');
            } else {
                throw err;
                console.log(user);
            }
        });
    }
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        User.getUserByUsername(username, (err, user) => {
            if (err)
                throw err;
            if (!user)
                return done(null, false, {
                    message: 'Unknown User'
                });
            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err)
                    throw err;
                if (isMatch)
                    return done(null, user);
                else
                    return done(null, false, {
                        message: 'Invalid Password'
                    });
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});

router.post('/login', passport.authenticate('local', {
        failureRedirect: '/users/login',
        failureFlash: true
    }),
    (req, res) => {
        res.redirect('/users/dashboard');
    });

module.exports = router;