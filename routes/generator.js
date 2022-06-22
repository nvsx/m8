import express from 'express'
const router = express.Router()

import generatorController from '../controllers/generatorController.js'

router.get('/m8/generate/build/*', generatorController.generate)
router.get('/m8/generate/delete/*', generatorController.delete)
router.get('*', generatorController.generate)

export default router
