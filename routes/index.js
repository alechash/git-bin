import express from 'express';
import dotenv from 'dotenv';
import Paste from '../models/Paste.js'
import User from '../models/User.js'
import funcs from '../config/functions.js'
import passportFile from '../config/passport.js'
import passport from 'passport';
const router = express.Router()

dotenv.config()
passportFile(passport)

var about = {
    title: `${process.env.NAME}`,
    template: 'main/index',
    admin: false,
    name: process.env.NAME
}

router.get('/*', function (req, res, next) {
    about.loggedin = req.user ? true : false
    about.user = req.user

    next()
})

router.get('/', function (req, res) {
    about.header = 'New Paste'
    about.title = 'New Paste'
    about.template = 'main/index'

    return res.render('base', about)
})

router.get('/b/:id', async function (req, res) {
    const pasteId = req.params.id
    const paste = await Paste.findOne({
        'meta.shortCode': pasteId
    })

    const owner = await User.findOne({
        'githubId': paste.meta.owner
    })

    about.header = paste.meta.name
    about.title = paste.meta.name
    about.template = 'main/paste'
    about.paste = paste
    about.pasteOwner = owner

    return res.render('base', about)
})

router.post('/paste/new', function (req, res) {
    const body = req.body.paste
    const name = req.body.name
    const publicity = req.body.publicity
    const syntax = req.body.syntax
    const shortCode = funcs.shortCode(7)
    const owner = req.user ? req.user.githubId : ''

    const newPaste = new Paste({
        paste: body,
        'meta.date': Date.now(),
        'meta.name': name,
        'meta.syntax': syntax,
        'meta.publicity': publicity,
        'meta.shortCode': shortCode,
        'meta.owner': owner
    })

    newPaste.save().then(paste => {
        return res.redirect(`/b/${shortCode}`)
    })
})

router.get('/auth/github', passport.authenticate('github', {
    scope: ['user:email']
}), function (req, res) {});

router.get('/auth/github/callback', passport.authenticate('github', {
    scope: ['user:email']
}), async function (req, res, next) {
    return res.redirect('/account')
})

router.get('/logout', (req, res) => {
    const loggedin = req.user ? true : false
    req.logout()

    if (!loggedin) {
        return res.redirect('/')
    } else {
        req.logout();
        return res.redirect('/logout')
    }
});

router.get('/account', (req, res) => {
    const loggedin = req.user ? true : false

    if (loggedin) {
        return res.send('hello authed user')
    } else {
        return res.redirect('/auth/github')
    }
});

export default router