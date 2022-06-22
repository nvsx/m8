import express from 'express'
const router = express.Router()

import ceElements from '../controllers/ceElements.js'

router.get('/m8/ce/elements/', ceElements.list)

export default router
