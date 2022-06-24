import express from 'express'
const router = express.Router()

import ceNodes from '../controllers/ceNodes.js'

router.get('/_m8/ce/nodes/create/', ceNodes.create)
router.post('/_m8/ce/nodes/createsave/', ceNodes.createsave)
router.get('/_m8/ce/nodes/read/', ceNodes.read)
router.post('/_m8/ce/nodes/update/', ceNodes.update)
router.post('/_m8/ce/nodes/delete/', ceNodes.delete)
router.get('/_m8/ce/nodes/', ceNodes.list)

export default router
