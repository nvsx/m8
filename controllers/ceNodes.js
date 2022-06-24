import Node from '../models/Node.js'
import axios from 'axios'

const build_url = 'http://localhost:8088/_m8/cegenerator/build'
const delete_url = 'http://localhost:8088/_m8/cegenerator/delete'

const ceNodes = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/nodes/list.ejs'
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.title = 'List of containers'
    locals.content = '<!-- +++ list of containers +++ -->'
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
    locals.title = 'create new container'
    locals.formaction = '/_m8/ce/nodes/createsave'
    let ce_template = 'm8/ce/nodes/create.ejs'
    res.render(ce_template, locals)
  },

  createsave: function (req, res) {
    // POST new
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.node = {}
    locals.title = 'save new container'
    locals.node.id = req.body.nodeid;
    req.body.id = undefined
    Node.create(req.body).then(result => {
      locals.content = JSON.stringify(result, null, 2)
      res.render('m8/ce/nodes/created.ejs', locals)
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
    let nodeid = req.query.id
    if(! nodeid) { nodeid = 0}
    Node.findByPk(nodeid).then(thisNode => {
      let locals = {}
      locals.nav_active_nodes = 'active'
      locals.node = thisNode
      locals.title  = `Container ${nodeid}`
      locals.formaction = '/_m8/ce/nodes/update'
      let ce_template = 'm8/ce/nodes/edit.ejs'
      res.render(ce_template, locals)
    })
  },

  update: function (req, res) {
    // POST update
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.node = {}
    locals.title = 'update container'
    let nodeid = req.body.nodeid;
    Node.findByPk(nodeid).then( thisNode => {
      console.log(JSON.stringify(req.body, null, 2))
      thisNode.set(req.body)
      thisNode.save()
      // res.send("cenodes: update " + nodeid )
      res.redirect(302, '/_m8/ce/nodes/read?id=' + nodeid);
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
    locals.nav_active_nodes = 'active'
    locals.node = {}
    locals.title = 'delete container'
    locals.node.id = req.body.nodeid
    const has_confirm = req.body.confirm
    console.log("    ---> delete:", has_confirm)
    if(has_confirm == 'on') {
      Node.findByPk(req.body.nodeid).then(thisNode => {
        thisNode.destroy()
      })
      // delete public file
      if(req.body.path && req.body.path !== '' && req.body.confirm === 'confirm') {
        console.log("    -> sending request to delete", req.body.path)
        axios.get(delete_url + req.body.path).then(resp => {
          // console.log(resp.data)
          console.log("    axios ok")
        }).catch( err => {
          console.log(err)
        })
      }
      else {
        console.log("WARNING: can not delete container file on disk, no path in body")
      }
    } 
    else {
      console.log("    -> missing confirm, can not delete container")
    }
    res.redirect(302, '/_m8/ce/nodes');
  }
}

export default ceNodes
