import Node from '../models/Node.js'
import Element2Node from '../models/Element2Node.js'
import axios from 'axios'
// import path from 'path'
// import fs from 'fs'
// import getNodes from './helpers/get_nodes.js'

const public_dir = '../public'
let ce_template = 'm8/ce/index.ejs'
let url_prefix = '/_m8/files/'
let dir_prefix = '../files/'

const ceShortcuts = {

  list: function (req, res) {
    // GET list
    let ce_template = 'm8/ce/shortcuts/index.ejs'
    let locals = {}
    locals.nav_active_shortcuts = 'active'
    locals.title = 'List of Shortcuts'
    locals.content = ''
    Node.findAll({
        where: {
          type: "shortcut"
        },
      order: [
        ['parentid', 'ASC'],
        ['num', 'ASC'],
        ['path', 'ASC']
    ],
    }).then(all_nodes => {
      // let sorted_nodes = getNodes.getList(null, all_nodes, {})
      locals.all_nodes = all_nodes
      // locals.all_nodes = sorted_nodes
      locals.page = {}
      locals.page.verbose = 2
      res.render(ce_template, locals)
    })
  },

  edit: function (req, res) {
    // GET single
    let nodeid = req.query.id
    let ce_template = 'm8/ce/shortcuts/edit.ejs'
    let locals = {}
    locals.nav_active_nodes = 'active'
    locals.formaction = '/_m8/ce/nodes/update'
    if(! nodeid) { nodeid = 0}
    Node.findByPk(nodeid).then(thisNode => {
      locals.node = thisNode
      locals.title  = `Page ${nodeid}`
    })
    .then(
      Element2Node.findAll( { where: { nodeId: nodeid }} )
      .then( mappingResult => {
        // console.log(JSON.stringify(mappingResult, null, 4))
        locals.all_mappings = mappingResult
        res.render(ce_template, locals)
      })
    )
  }

}

export default ceShortcuts
