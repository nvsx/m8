import express from 'express'
const router = express.Router()

import generatorController from '../controllers/generatorController.js'

router.get('/_m8/cegenerator/build/*', generatorController.generate)
router.get('/_m8/cegenerator/delete/*', generatorController.delete)
router.get('*', generatorController.generate)

export default router
