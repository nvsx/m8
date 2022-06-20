import express from 'express'
const router = express.Router()

import generatorController from '../controllers/generatorController.js'


router.get('/m8/generate/view', generatorController.gen_view)
router.get('/m8/generate/node', generatorController.gen_node)
router.get('/m8/generate/article', generatorController.gen_article)
router.get('*', generatorController.generate)

export default router
