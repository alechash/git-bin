import express from 'express';
import dotenv from 'dotenv';
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
    return res.render('base', about)
})

export default router