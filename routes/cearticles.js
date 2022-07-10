import express from 'express'
const router = express.Router()

import ceArticles from '../controllers/ceArticles.js'

router.post('/_m8/ce/articles/create/', ceArticles.create)
router.get('/_m8/ce/articles/edit/', ceArticles.edit)
router.post('/_m8/ce/articles/save/', ceArticles.save)
router.post('/_m8/ce/articles/delete/', ceArticles.delete)
router.get('/_m8/ce/articles/', ceArticles.list)

export default router
