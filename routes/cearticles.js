import express from 'express'
const router = express.Router()

import ceArticles from '../controllers/ceArticles.js'

router.get('/_m8/ce/articles/create/', ceArticles.create)
router.post('/_m8/ce/articles/createsave/', ceArticles.createsave)
router.get('/_m8/ce/articles/read/', ceArticles.read)
router.post('/_m8/ce/articles/update/', ceArticles.update)
router.post('/_m8/ce/articles/delete/', ceArticles.delete)
router.get('/_m8/ce/articles/', ceArticles.list)

export default router
