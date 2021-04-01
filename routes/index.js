import express from 'express';
import dotenv from 'dotenv';
import Paste from '../models/Paste.js'
import funcs from '../config/functions.js'
const router = express.Router()

dotenv.config()

var about = {
    title: `${process.env.NAME}`,
    template: 'main/index',
    admin: false,
    name: process.env.NAME
}

router.get('/', function (req, res) {
    about.header = 'New Paste'
    about.title = 'New Paste'
    about.template = 'main/index'

    return res.render('base', about)
})

router.post('/paste/new', function (req, res) {
    const body = req.body.paste
    const name = req.body.name
    const publicity = req.body.publicity
    const syntax = req.body.syntax
    const shortCode = funcs.shortCode(7)

    const newPaste = new Paste({
        paste: body,
        'meta.date': Date.now(),
        'meta.name': name,
        'meta.syntax': syntax,
        'meta.publicity': publicity,
        'meta.shortCode': shortCode
    })

    newPaste.save().then(paste => {
        return res.redirect(`/p/${shortCode}`)
    })
})

export default router