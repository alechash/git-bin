import dotenv from 'dotenv';
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import funcs from './functions.js'

var callback = ''

if (process.env.ENV == 'dev') {
    callback = 'http://localhost:3000/auth/github/callback'
} else {
    callback = process.env.PROD_CALLBACK
}

dotenv.config()

export default function (passport) {
    passport.use(new GitHubStrategy.Strategy({
            clientID: process.env.GH_CLIENT,
            clientSecret: process.env.GH_SECRET,
            callbackURL: callback
        },
        async function (accessToken, refreshToken, profile, done) {
            const exists = await User.exists({
                githubId: profile._json.id,
            })

            if (exists == false) {
                const newUser = new User({
                    username: profile.username,
                    email: profile._json.email,
                    bio: profile._json.bio,
                    github: profile.username,
                    githubId: profile._json.id,
                    website: profile._json.blog,
                    apiKey: funcs.shortCode(50)
                });

                newUser.save().then(user => {
                    done(null, user);
                })
            } else {
                const updateUser = await User.findOneAndUpdate({
                    githubId: profile._json.id,
                }, {
                    github: profile.username,
                }, function (err, user) {});

                updateUser.save().then(user => {
                    done(null, user);
                })
            }
        }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};