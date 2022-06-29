import axios from 'axios'
// import { classToInvokable } from 'sequelize/types/utils.js'
// import Article from '../models/Article.js'
import Node    from '../models/Node.js'

//console.log("xxxxxx controller: ", global.global)

// Article.belongsTo(Node)

const build_url = 'http://localhost:8088/_m8/cegenerator/build'
const delete_url = 'http://localhost:8088/_m8/cegenerator/delete'

const ceArticles = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/articles/list.ejs'
    let locals = {}
    locals.nav_active_articles = 'active'
    locals.title = ''
    locals.content = '<!-- +++ list of articles +++ -->'
    Node.findAll({
      where: {
        type: "article"
      },
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
    let req_body = req.body
    req_body.type = 'article'
    let locals = {}
    locals.nav_active_articles = 'active'
    locals.title = 'save new article'
    req.body.id = undefined
    Node.create(req_body).then(result => {
      locals.content = JSON.stringify(result, null, 2)
      if(result.id) {
        let redirect_url = '/_m8/ce/articles/read?articleid=' + result.id
        res.redirect(redirect_url)
      }
      else {
        res.render('m8/ce/articles/created.ejs', locals)
      }
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
    Node.findByPk(articleid).then(thisArticle => {
      if(thisArticle && thisArticle.type === 'article') {
        let locals = {}
        locals.nav_active_articles = 'active'
        locals.title  = `edit node ${articleid}`
        locals.formaction = '/_m8/ce/articles/update'
        let parentid = 0
        if(thisArticle.parentid) {
          parentid = thisArticle.parentid
          thisArticle.channel = parentid
          // console.log("    reading article, parentid=", parentid)
        }
        Node.findOne({
          where: {
            id: parentid
          }
        }).then( myNode => {
          let channelPath = ''
          if(myNode && myNode.path) { 
            channelPath = myNode.path 
          }
          locals.channelPath = channelPath
          locals.article = thisArticle
          res.render('m8/ce/articles/edit.ejs', locals)
        })
      }
      else {
        // TODO: Pretty page with link
        let locals = {}
        locals.status = 'error articleid not valid'
        locals.message = "Article not found. <a href=\"javascript:history.back();\">back</a>"
        res.render('m8/ce/error.ejs', locals)
      }
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
    Node.findByPk(article_id).then( thisArticle => {
      let myChannel = req_body.channel
      myChannel = parseInt(myChannel)
      if(! Number.isInteger(myChannel)) { myChannel = 1}
      req_body.parentid = myChannel
      // slug
      let mySlug = req_body.slug
      mySlug = mySlug.replace(/\s/g, '_')
      mySlug = mySlug.replace(/\.html$/, '')
      req_body.slug = mySlug
      // path
      let myPath = req_body.path
      myPath = myPath.replace(/\s/g, '_')
      myPath = myPath.replace(/\/$/, '')
      myPath = myPath.replace(/\.html$/, '')
      // todo: myChannelPath = path of channel
      let myChannelPath= ''
      if(myPath !== '') {
        myPath = myPath + '.html'
      }
      else {
        myPath = myChannelPath + mySlug + '.html'
      }
      if(req_body.old_path !== '' && req_body.old_path !== myPath) {
        // TODO: delete old file from cache:
        console.log("    ---------> TODO: delete old file (ceArticles, L140)")
        console.log("                     path_now:", req_body.path)
        console.log("                     path_old:", req_body.old_path)
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
      // also refresh channel page because of latest_articles_list
      console.log("    ---------> TODO: also refresh channel center")
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
    Node.findByPk(req.body.articleid).then(thisArticle => {
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
