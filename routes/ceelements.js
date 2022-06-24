import express from 'express'
const router = express.Router()

import ceElements from '../controllers/ceElements.js'

router.get('/_m8/ce/elements/', ceElements.list)

export default router
