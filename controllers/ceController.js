import axios from 'axios'
import { exec } from 'child_process'
import Node    from '../models/Node.js'
// import { Sequelize, Model, DataTypes } from 'sequelize'
// import sequelize from '../modules/database.js'
// import fs from 'fs'

const build_url = 'http://localhost:8088/_m8/cegenerator/build'
const output_dir = '../public'
const input_dir  = '../site/views'
const ce_template = 'm8/ce/index.ejs'
const node_template = 'site/m8/layouts/default.ejs'

const ceController = {
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  ce: function (req, res) {
    let locals = {}
    locals.nav_active_start = 'active'
    locals.title = 'CE: Start'
    locals.siteconfig = global.__sitecfg
    locals.m8info = global.__m8info
    locals.content = ''
    res.render(ce_template, locals)
    // console.log(req.layout)
    // res.sendStatus(200)
  }, 
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  staticbuild: function(req, res) {
    // do/import
    // do/buildpages
    // do/buildnodes
    console.log("-----> building static content <--------------------------")
    // ----------------------------------------
    // do/import
    console.log("    -> import...")
    exec("cd .. && run/import &", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
    // ----------------------------------------
    // do/buildpages
    console.log("    -> build views...")
    // system("cd ..; do/import")
    exec("cd .. && run/buildpages &", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
    // ----------------------------------------
    // build nodes
    console.log("    -> build nodes")
    //  where: {
    //   exists: 1,
    //   islive: 1
    // },
    Node.findAll({})
    .then(all_nodes => {
      let node_counter = 0
      while (node_counter < all_nodes.length){
        console.log("building node", all_nodes[node_counter].id)
        let node_url = all_nodes[node_counter].path
        console.log("         path", node_url)
        if(node_url) {
          axios.get(build_url + node_url).then(resp => {
            // console.log(resp.data)
            console.log("           axios", node_url)
            console.log("               -> ok")
          }).catch( err => {
            console.log("           axios", node_url)
            console.log("               -> error")
            // console.log(err)
          })
        } 
        else {
          console.log("         ERROR: node has empty path")
        }
        node_counter = node_counter +1
      }
    })
    .catch(err => console.log(err))
    res.redirect('/_m8/ce/');
  }, 
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  staticpublish: function(req, res) {
    console.log("----> publishing static content <----------------------")
    exec("cd .. && run/publish &", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
    res.redirect('/_m8/ce/');
  }
}

export default ceController
