import express from 'express'
const router = express.Router()

import ceController from '../controllers/ceController.js'

router.get('/m8/ce/', ceController.run)

export default router
