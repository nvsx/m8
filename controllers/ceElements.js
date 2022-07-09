import Element from '../models/Element.js'
// import Node from '../models/Node.js'
import Element2Node from '../models/Element2Node.js'

const ceElements = {

  list: function (req, res) {
    let locals = {}
    let orderBy = 'updatedAt'
    let orderHow = 'DESC'
    if(req.query.orderby) {
      orderBy = req.query.orderby
    }
    //  ['id', 'ASC']
    locals.nav_active_elements = 'active'
    locals.title = 'Elements'
    locals.content = '<!-- +++ list of elements +++ -->'
    Element.findAll({
      order: [
        [orderBy, orderHow]
    ],
    }).then(all_elements => {
      locals.all_elements = all_elements
      locals.page = {}
      locals.page.verbose = 2
      res.render('m8/ce/elements/index.ejs', locals)
    })
  },

  create: function(req, res) {
    let initialData = {}
    Element.create(initialData).then(result => {
      res.redirect(302, '/_m8/ce/elements/edit?id=' + result.id);
    })
  },

  edit: function(req, res) {
    let elementId = req.query.id
    let elementResult
    let mappingResult
    let locals = {}
    let ce_template = 'm8/ce/elements/edit.ejs'
    if(! elementId) { 
      elementId = 0
    }
    Element.findByPk(elementId)
    .then( thisResult => {
      locals.object = thisResult
    })
    .then(
      Element2Node.findAll( { where: { elementId: elementId }} )
      .then( mappingResult => {
        console.log(JSON.stringify(mappingResult, null, 4))
        locals.all_mappings = mappingResult
        locals.title  = `Element ${elementId}`
        locals.formaction = '/_m8/ce/elements/update'
        locals.nav_active_nodes = 'active'
        res.render(ce_template, locals)
      })
    )
  }, 

  update: function (req, res) {
    // POST update
    let locals = {}
    let req_body = req.body
    locals.nav_active_nodes = 'active'
    locals.data = {}
    locals.title = 'update container'
    let thisId = req.body.id;
    // console.log("WRITE",req.body.content)
    Element.findByPk(thisId).then( thisObject => {
      thisObject.set(req_body)
      thisObject.save()
      res.redirect(302, '/_m8/ce/elements/edit?id=' + thisId);
    })
  }
}

export default ceElements
