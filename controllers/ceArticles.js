import Article from '../models/Article.js'

const ceArticles = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/articles/list.ejs'
    let locals = {}
    locals.title = 'List of articles'
    locals.content = '<!-- +++ list of articles +++ -->'
    Article.findAll({
      order: [
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
    locals.article.title = 'new article title'
    locals.title = 'create article'
    locals.formaction = '/m8/ce/articles/createsave'
    let ce_template = 'm8/ce/articles/create.ejs'
    res.render(ce_template, locals)
  },

  createsave: function (req, res) {
    // POST new
    let locals = {}
    locals.title = 'save new article'
    req.body.id = undefined
    Article.create(req.body).then(result => {
      locals.content = JSON.stringify(result, null, 2)
      res.render('m8/ce/articles/created.ejs', locals)
    })
  },
    
  read: function (req, res) {
    // GET single
    let articleid = req.query.articleid
    if(! articleid) { articleid = 0}
    Article.findByPk(articleid).then(thisArticle => {
      let locals = {}
      locals.article = thisArticle
      locals.title  = `edit node ${articleid}`
      locals.formaction = '/m8/ce/articles/update'
      let ce_template = 'm8/ce/articles/edit.ejs'
      res.render(ce_template, locals)
    })

  }
}

export default ceArticles
