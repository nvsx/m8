import Article from '../models/Article.js'
import axios from 'axios'

const build_url = 'http://localhost:8088/m8/generate/build'
const delete_url = 'http://localhost:8088/m8/generate/delete'

const ceArticles = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/articles/list.ejs'
    let locals = {}
    locals.nav_active_articles = 'active'
    locals.title = 'List of articles'
    locals.content = '<!-- +++ list of articles +++ -->'
    Article.findAll({
      order: [
        ['updatedAt', 'DESC'],
        ['createdAt', 'DESC'],
        ['id', 'DESC']
    ],
    }).then(all_articles => {
      locals.all_articles = all_articles
      res.render(ce_template, locals)
    }).catch(err => console.log(err))
  },

  create: function (req, res) {
    // GET create form
    let locals = {}
    locals.article = {}
    locals.nav_active_articles = 'active'
    locals.article.title = 'new article title'
    locals.title = 'create article'
    locals.formaction = '/m8/ce/articles/createsave'
    let ce_template = 'm8/ce/articles/create.ejs'
    res.render(ce_template, locals)
  },

  createsave: function (req, res) {
    // POST new
    let locals = {}
    locals.nav_active_articles = 'active'
    locals.title = 'save new article'
    req.body.id = undefined
    Article.create(req.body).then(result => {
      locals.content = JSON.stringify(result, null, 2)
      res.render('m8/ce/articles/created.ejs', locals)
    })
    // build file
    axios.get(build_url + req.body.path).then(resp => {
      // console.log(resp.data)
      console.log("    axios ok")
    }).catch( err => {
      console.log(err)
    })
  },
    
  read: function (req, res) {
    // GET single
    let articleid = req.query.articleid
    if(! articleid) { articleid = 0}
    Article.findByPk(articleid).then(thisArticle => {
      let locals = {}
      locals.nav_active_articles = 'active'
      locals.article = thisArticle
      locals.title  = `edit node ${articleid}`
      locals.formaction = '/m8/ce/articles/update'
      let ce_template = 'm8/ce/articles/edit.ejs'
      res.render(ce_template, locals)
    })
  },

  update: function (req, res) {
    // POST update
    console.log("-------------------------")
    console.log("saving article")
    let locals = {}
    locals.nav_active_articles = 'active'
    locals.node = {}
    locals.title = 'update article'
    let article_id = req.body.id;
    console.log("    channel:", req.body.channel)
    console.log("    channel_old:", req.body.channel_old)
    Article.findByPk(article_id).then( thisArticle => {
      console.log(JSON.stringify(req.body, null, 2))
      thisArticle.set(req.body)
      thisArticle.save()
      res.redirect(302, '/m8/ce/articles/read?articleid=' + article_id);
    })
    // build file
    axios.get(build_url + req.body.path).then(resp => {
      // console.log(resp.data)
      console.log("    axios ok")
    }).catch( err => {
      console.log(err)
    })
  },

  delete: function (req, res) {
    // POST delete
    let locals = {}
    locals.nav_active_articles = 'active'
    locals.node = {}
    locals.title = 'delete article'
    locals.node.id = req.body.articleid;
    Article.findByPk(req.body.articleid).then(thisArticle => {
      thisArticle.destroy()
    })
    // delete public file
    if(req.body.path && req.body.path !== '') {
      console.log("    -> sending request to delete", req.body.path)
      axios.get(delete_url + req.body.path).then(resp => {
        // console.log(resp.data)
        console.log("    axios ok")
      }).catch( err => {
        console.log(err)
      })
    }
    else {
      console.log("WARNING: can not delete file on disk, no path in body")
    }
    res.redirect(302, '/m8/ce/articles')
  }
}

export default ceArticles
