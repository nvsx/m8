import Node from '../models/Node.js'

const ceNodes = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/nodes/list.ejs'
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.title = 'List of nodes'
    locals.content = '<!-- +++ list of nodes +++ -->'
    Node.findAll({
      order: [
        ['path', 'ASC']
    ],
    }).then(all_nodes => {
      locals.all_nodes = all_nodes
      res.render(ce_template, locals)
    })
  },

  create: function (req, res) {
    // GET create form
    let locals = {}
    locals.node = {}
    locals.nav_active_nodes = 'active'
    locals.node.title = 'new page title'
    locals.title = 'create node'
    locals.formaction = '/m8/ce/nodes/createsave'
    let ce_template = 'm8/ce/nodes/create.ejs'
    res.render(ce_template, locals)
  },

  createsave: function (req, res) {
    // POST new
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.node = {}
    locals.title = 'save new node'
    locals.node.id = req.body.nodeid;
    req.body.id = undefined
    Node.create(req.body).then(result => {
      locals.content = JSON.stringify(result, null, 2)
      res.render('m8/ce/nodes/created.ejs', locals)
    })
  },

  read: function (req, res) {
    // GET single
    let nodeid = req.query.id
    if(! nodeid) { nodeid = 0}
    Node.findByPk(nodeid).then(thisNode => {
      let locals = {}
      locals.nav_active_nodes = 'active'
      locals.node = thisNode
      locals.title  = `edit node ${nodeid}`
      locals.formaction = '/m8/ce/nodes/update'
      let ce_template = 'm8/ce/nodes/edit.ejs'
      res.render(ce_template, locals)
    })
  },

  update: function (req, res) {
    // POST update
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.node = {}
    locals.title = 'update node'
    let nodeid = req.body.nodeid;
    Node.findByPk(nodeid).then( thisNode => {
      console.log(JSON.stringify(req.body, null, 2))
      thisNode.set(req.body)
      thisNode.save()
      // res.send("cenodes: update " + nodeid )
      res.redirect(302, '/m8/ce/nodes/read?id=' + nodeid);
    })
  },

  delete: function (req, res) {
    // POST delete
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.node = {}
    locals.title = 'delete node'
    locals.node.id = req.body.nodeid;
    Node.findByPk(req.body.nodeid).then(thisNode => {
      thisNode.destroy()
    })
    // res.send("cenodes: delete: " + locals.node.id).sendStatus(200)
    res.redirect(302, '/m8/ce/nodes');
  }
}

export default ceNodes
