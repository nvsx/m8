import express from 'express'
const router = express.Router()

import ceContainers from '../controllers/ceContainers.js'

router.get('/create/', ceContainers.create)
router.post('/createsave/', ceContainers.createsave)
router.get('/edit/', ceContainers.edit)
router.post('/update/', ceContainers.update)
router.post('/delete/', ceContainers.delete)
router.get('/', ceContainers.list)

export default router
