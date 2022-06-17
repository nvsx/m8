// import { resolveInclude } from 'ejs'
import Page from '../models/Page.js'

const public_dir = '../public'
let ce_template = 'm8/ce/index.ejs'

const cePages = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/pages/list.ejs'
    let locals = {}
    locals.title = 'List of pages'
    locals.content = '<!-- +++ list of pages +++ -->'
    Page.findAll().then(all_pages => {
      locals.all_pages = all_pages
      res.render(ce_template, locals)
    })
  },

  create: function (req, res) {
    // GET create form
    let locals = {}
    locals.page = {}
    locals.title = 'create page'
    locals.page.id = 'create new page'
    locals.formaction = '/m8/ce/pages/createsave'
    let ce_template = 'm8/ce/pages/create.ejs'
    res.render(ce_template, locals)
  },

  createsave: function (req, res) {
    // POST new
    let locals = {}
    locals.page = {}
    locals.title = 'save new page'
    locals.page.id = req.body.pageid;
    req.body.id = undefined
    Page.create(req.body).then(result => {
      locals.content = JSON.stringify(result, null, 2)
      res.render('m8/ce/pages/created.ejs', locals)
    })
  },

  read: function (req, res) {
    // GET single
    let pageid = req.query.id
    if(! pageid) { pageid = 0}
    Page.findByPk(pageid).then(thisPage => {
      let locals = {}
      locals.page = thisPage
      locals.title  = `edit page ${pageid}`
      locals.formaction = '/m8/ce/pages/update'
      let ce_template = 'm8/ce/pages/edit.ejs'
      res.render(ce_template, locals)
    })
  },

  update: function (req, res) {
    // POST update
    let locals = {}
    locals.page = {}
    locals.title = 'update page'
    let pageid = req.body.pageid;
    Page.findByPk(pageid).then( thisPage => {
      console.log(JSON.stringify(req.body, null, 2))
      thisPage.set(req.body)
      thisPage.save()
      // res.send("cepages: update " + pageid )
      res.redirect(302, '/m8/ce/pages/read?id=' + pageid);
    })
  },

  delete: function (req, res) {
    // POST delete
    let locals = {}
    locals.page = {}
    locals.title = 'delete page'
    locals.page.id = req.body.pageid;
    Page.findByPk(req.body.pageid).then(thisPage => {
      thisPage.destroy()
    })
    // res.send("cepages: delete: " + locals.page.id).sendStatus(200)
    res.redirect(302, '/m8/ce/pages');
  }
}

export default cePages
