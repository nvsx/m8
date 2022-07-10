import Node from '../models/Node.js'
import axios from 'axios'
import getNodes from './helpers/get_nodes.js'
import Element2Node from '../models/Element2Node.js'

const build_url = 'http://localhost:8088/_m8/cegenerator/build'
const delete_url = 'http://localhost:8088/_m8/cegenerator/delete'

// ['parentid', 'ASC'],
// ['num', 'ASC'],
// ['path', 'ASC']

const ceNodes = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/nodes/list.ejs'
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.title = 'List of containers'
    locals.content = ''
    Node.findAll({
      order: [
        ['id', 'DESC']
      ],
    }).then(all_nodes => {
      let sorted_nodes = getNodes.getList(null, all_nodes, {})
      locals.all_nodes = all_nodes
      // locals.all_nodes = sorted_nodes
      locals.page = {}
      locals.page.verbose = 2
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
      // console.log(err)
      console.log("    axios error")
    })
  },

  edit: function (req, res) {
    // GET single
    let nodeid = req.query.id
    if(! nodeid) { nodeid = 0}
    let ce_template = 'm8/ce/nodes/edit.ejs'
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.title  = `Container ${nodeid}`
    locals.formaction = '/_m8/ce/nodes/update'
    Node.findByPk(nodeid)
    .then(thisNode => {
      locals.node = thisNode
    })
    .then(
      Element2Node.findAll( { where: { nodeId: nodeid }} )
      .then( mappingResult => {
        locals.all_mappings = mappingResult
        res.render(ce_template, locals)
      })
    )
  },

  open: function (req, res) {
    // GET redirect
    let nodeid = req.query.id
    if(! nodeid) { nodeid = 0}
    Node.findByPk(nodeid)
    .then(thisNode => {
      let type = thisNode.type
      let redirect_url = '/_m8/ce/'
      console.log("- - - - > node type", type)
      if(type === 'article') {
        redirect_url = redirect_url + 'articles/edit?articleid=' + nodeid
      }
      else if(type === 'container') {
        redirect_url = redirect_url + 'containers/edit?id=' + nodeid
      }
      else if(type === 'page') {
        redirect_url = redirect_url + 'pages/edit?id=' + nodeid
      }
      res.redirect(redirect_url)
    })
  },

  update: function (req, res) {
    // POST update
    let locals = {}
    let req_body = req.body
    locals.nav_active_nodes = 'active'
    locals.node = {}
    locals.title = 'update container'
    let nodeid = req.body.nodeid;
    Node.findByPk(nodeid).then( thisNode => {
      // ord
      let myOrd = req_body.num
      myOrd = parseInt(myOrd)
      // if(! Number.isInteger(myOrd)) { 
      //   myOrd = 999
      //   req_body.ord = myOrd 
      // }
      // parent
      let myParentid = req_body.parentid
      myParentid = parseInt(myParentid)
      if(! Number.isInteger(myParentid)) { 
        myParentid = 0
      }
      req_body.parentid = myParentid
      // path
      let myPath = req_body.path
      const slashRegexEnd = /\/$/g
      const slashEnd = myPath.match(slashRegexEnd)? true : false
      if(! slashEnd ) {
        req_body.path = req_body.path + "/" 
      }
      // type
      // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++")
      // console.log(req.body.type)
      // let myType = req_body.type
      // myType = "container"
      // req_body.type = myType
      // console.log(JSON.stringify(req_body, null, 2))
      thisNode.set(req_body)
      thisNode.save()
      res.redirect(302, '/_m8/ce/nodes/read?id=' + nodeid);
    })
    // build file
    axios.get(build_url + req.body.path).then(resp => {
      // console.log(resp.data)
      console.log("    axios ok")
    }).catch( err => {
      //console.log(err)
      console.log("    axios error")
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
          // console.log(err)
          console.log("    axios error")
        })
      }
      else {
        console.log("WARNING: can not delete file on disk, no path in body")
      }
    } 
    else {
      console.log("    -> missing confirm, can not delete container")
    }
    res.redirect(302, '/_m8/ce/nodes');
  }
}

export default ceNodes
