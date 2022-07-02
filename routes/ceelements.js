import express from 'express'
const router = express.Router()

import ceElements from '../controllers/ceElements.js'

router.post('/create/', ceElements.create)
router.post('/update/', ceElements.update)
router.get('/read/', ceElements.read)
router.get('/', ceElements.list)

export default router
