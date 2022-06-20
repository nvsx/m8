import express from 'express'
const router = express.Router()

import ceController from '../controllers/ceController.js'

router.get('/m8/ce/', ceController.ce)
// router.get('/m8/dbgen/', ceController.dbgen)
// router.get('/m8/staticgen/', ceController.staticgen)

export default router
