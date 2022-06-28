import express from 'express'
const router = express.Router()

import ceNodes from '../controllers/ceNodes.js'

router.get('/create/', ceNodes.create)
router.post('/createsave/', ceNodes.createsave)
router.get('/read/', ceNodes.read)
router.post('/update/', ceNodes.update)
router.post('/delete/', ceNodes.delete)
router.get('/', ceNodes.list)

export default router
