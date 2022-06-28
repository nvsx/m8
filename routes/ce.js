import express from 'express'
const router = express.Router()

import ceController from '../controllers/ceController.js'

router.get('/', ceController.ce)
router.get('/staticbuild/', ceController.staticbuild)
router.get('/staticpublish/', ceController.staticpublish)

export default router
