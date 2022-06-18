import express from 'express'
const router = express.Router()

import ceNodes from '../controllers/ceNodes.js'

router.get('/m8/ce/nodes/create/', ceNodes.create)
router.post('/m8/ce/nodes/createsave/', ceNodes.createsave)
router.get('/m8/ce/nodes/read/', ceNodes.read)
router.post('/m8/ce/nodes/update/', ceNodes.update)
router.post('/m8/ce/nodes/delete/', ceNodes.delete)
router.get('/m8/ce/nodes/', ceNodes.list)

export default router
