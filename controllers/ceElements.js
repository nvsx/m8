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
  },

  mappage: function(req, res) {
    console.log("new mapping for page", req.body.nodeid)

    let elementId = req.body.elementid
    let nodeId    = req.body.nodeid
    let posrow    = req.body.posrow || 1
    let posnum    = req.body.posnum || 1

    let newData = {}
    newData.elementId = elementId
    newData.nodeId    = nodeId
    newData.posrow    = posrow
    newData.posnum    = posnum
    console.log(JSON.stringify(newData, null, 2))

    Element2Node.create(newData).then(result => {
      if(result) {
        console.log("    SUCCESS: Created")
      }
      else {
        console.log("    ERROR: Can not create")
      }
      res.redirect('/_m8/ce/pages/edit?id=' + req.body.nodeid )
    })
  }
}

export default ceElements
