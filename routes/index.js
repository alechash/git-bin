import express from 'express';
import dotenv from 'dotenv';
import Paste from '../models/Paste.js'
import Shortener from '../models/Shortener.js'
import ShortStat from '../models/ShortStat.js'
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

router.get('/developer', function (req, res) {
    about.header = 'Developer Docs'
    about.title = 'Developer Docs'
    about.template = 'main/developer'

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

    about.header = `paste: ${paste.meta.name}`
    about.title = `paste: ${paste.meta.name}`
    about.template = 'main/paste'
    about.paste = paste
    about.pasteDate = funcs.timeDifference(Date.now(), paste.meta.date)
    about.pasteOwner = owner

    return res.render('base', about)
})

router.get('/s/:id/stats', async function (req, res) {
    const urlId = req.params.id
    const short = await Shortener.findOne({
        'meta.shortCode': urlId
    })

    const owner = await User.findOne({
        'githubId': short.meta.owner
    })

    const stats = await ShortStat.find({
        'shortCode': short.meta.shortCode
    })

    about.header = `short: ${short.meta.name ? short.meta.name : short.meta.shortCode}`
    about.title = `short stats for: ${short.meta.name ? short.meta.name : short.meta.shortCode}`
    about.template = 'main/shortener/stats'
    about.short = short
    about.shortDate = funcs.timeDifference(Date.now(), short.meta.date)
    about.shortOwner = owner
    about.stats = stats

    return res.render('base', about)
})

router.get('/s/:id', async function (req, res) {
    const urlId = req.params.id
    const short = await Shortener.findOne({
        'meta.shortCode': urlId
    })

    const browser = req.useragent.browser ? req.useragent.browser : 'Unknown'
    const version = req.useragent.version ? req.useragent.version : 'Unknown'
    const os = req.useragent.os ? req.useragent.os : 'Unknown'
    const platform = req.useragent.platform ? req.useragent.platform : 'Unknown'
    const userAgent = req.useragent.source ? req.useragent.source : 'Unknown'

    const newShortStat = new ShortStat({
        shortCode: urlId,
        'meta.browser': browser,
        'meta.version': version,
        'meta.os': os,
        'meta.platform': platform,
        'meta.userAgent': userAgent
    })

    newShortStat.save()

    return res.redirect(short.url)
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

router.post('/shorten/new', function (req, res) {
    const url = req.body.url
    const name = req.body.name
    const shortCode = funcs.shortCode(7)
    const owner = req.user ? req.user.githubId : ''

    const newShortener = new Shortener({
        url: url,
        'meta.date': Date.now(),
        'meta.name': name,
        'meta.shortCode': shortCode,
        'meta.owner': owner
    })

    newShortener.save().then(url => {
        return res.redirect(`/s/${shortCode}/stats`)
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

router.get('/account', async function (req, res) {
    const loggedin = req.user ? true : false

    if (loggedin) {
        const userId = req.user.githubId
        const shorts = await Shortener.find({
            'meta.owner': userId
        })
        const pastes = await Paste.find({
            'meta.owner': userId
        })

        about.pastes = pastes
        about.shorts = shorts

        about.header = `Your Account`
        about.title = `Your Account`
        about.template = 'main/account'
        about.user = req.user

        return res.render('base', about)
    } else {
        return res.redirect('/auth/github')
    }
});

export default router