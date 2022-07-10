import express from 'express'
const router = express.Router()

import ceConfigurationController from '../controllers/ceConfigurationController.js'

router.get('/', ceConfigurationController.list)

export default router
