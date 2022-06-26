import axios from 'axios'

import Article from '../models/Article.js'
import Node    from '../models/Node.js'

// Article.belongsTo(Node)

const build_url = 'http://localhost:8088/_m8/cegenerator/build'
const delete_url = 'http://localhost:8088/_m8/cegenerator/delete'

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
    locals.formaction = '/_m8/ce/articles/createsave'
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
      locals.formaction = '/_m8/ce/articles/update'
      const testNode = Node.findOne({
        where: {
          id: thisArticle.channel
        }
      }).then( myNode => {
        let channelPath = ''
        if(myNode && myNode.path) { channelPath = myNode.path }
        locals.channelPath = channelPath
        res.render('m8/ce/articles/edit.ejs', locals)
      });
    })
  },

  update: function (req, res) {
    // POST update
    console.log("-------------------------")
    console.log("saving article")

    let req_body = req.body
    let locals = {}
    locals.nav_active_articles = 'active'
    locals.node = {}
    locals.title = 'update article'
    let article_id = req.body.id;
    console.log("    channel:", req.body.channel)
    console.log("    channel_old:", req.body.channel_old)
    Article.findByPk(article_id).then( thisArticle => {
      // console.log(JSON.stringify(req.body, null, 2))
      // channel
      let myChannel = req_body.channel
      myChannel = parseInt(myChannel)
      if(! Number.isInteger(myChannel)) { myChannel = 0}
      let myChannelPath = '/'
      if (myChannel !== 0 ) { 
        // TODO: select channel from db, set myChannelPath
        // myChannelPath is node_path so always starting and ending with slashd
        // Node.findByPk(myChannelNumber).then(thisNode => {
        //   myChannelPath = thisNode.path
        // })
      }
      // slug
      let mySlug = req_body.slug
      mySlug = mySlug.replace(/\s/g, '_')
      mySlug = mySlug.replace(/\.html$/, '')
      req_body.slug = mySlug
      // path
      let myPath = req_body.path
      myPath = myPath.replace(/\/$/, '')
      myPath = myPath.replace(/\.html$/, '')
      if(myPath !== '') {
        myPath = myPath + '.html'
      }
      else {
        myPath = myChannelPath + mySlug + '.html'
      }
      if(req_body.old_path !== '' && myPath !== '' && req_body.old_path !== myPath) {
        // TODO: delete old file from cache:
        console.log("    TODO: delete olf file")
      }
      req_body.path = myPath
      thisArticle.set(req_body)
      thisArticle.save()
      // build file
      const refresh_request = build_url + req_body.path
      console.log("    REFRESH FILE REQUEST:", refresh_request)
      axios.get(refresh_request).then(resp => {
        // console.log(resp.data)
        console.log("    axios ok")
      }).catch( err => {
        console.log('   refresh sent an error:', err.response.status)
      })
      res.redirect(302, '/_m8/ce/articles/read?articleid=' + article_id);
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
    res.redirect(302, '/_m8/ce/articles')
  }
}

export default ceArticles
