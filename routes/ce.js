import express from 'express'
const router = express.Router()

import ceController from '../controllers/ceController.js'

router.get('/_m8/ce/', ceController.ce)
// router.get('/_m8/dbgen/', ceController.dbgen)
// router.get('/_m8/staticgen/', ceController.staticgen)

export default router
