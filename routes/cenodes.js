import express from 'express'
const router = express.Router()

import ceNodes from '../controllers/ceNodes.js'

router.get('/open/', ceNodes.open)
router.get('/create/', ceNodes.create)
router.post('/createsave/', ceNodes.createsave)
router.get('/edit/', ceNodes.edit)
router.post('/update/', ceNodes.update)
router.post('/delete/', ceNodes.delete)
router.get('/', ceNodes.list)

export default router
