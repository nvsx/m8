import express from 'express'
const router = express.Router()

import generatorController from '../controllers/generatorController.js'

router.get('*', generatorController.generate)

export default router
