import fs      from 'fs'
import path    from 'path'

import Node    from '../models/Node.js'
import Element from '../models/Element.js'
import Element2Node from '../models/Element2Node.js'

import breadcrumbBuilder from './helpers/breadcrumbBuilder.js'
import navigationBuilder from './helpers/navigationBuilder.js'

const output_dir     = '../public'
const views_dir      = '../site/views'
const ejs_default    = '_layout/default.ejs'
const ejs_article    = '_layout/article_default.ejs'
const ejs_homepage   = '_layout/homepage.ejs'
// const builder_path   = '/_m8/cegenerator/build'

const generator = {

  delete: function (req, res) {
    console.log("DELETE FILE FROM PUBLIC DIR")
    const req_path = req.path
    // console.log("    delete request:", req_path)
    const calc_path = req_path.replace(/^\/_m8\/cegenerator\/delete/, output_dir)
    const delete_path = calc_path.replace(/\/$/, '/index.html')
    console.log("    generator: delete file", delete_path)
    res.sendStatus(200)
    fs.unlink(delete_path, (err) => {
      if (err) {
        console.error(err)
      }
    })
  },

  generate: function (req, res) {
    // generate is called as fallback, if file is not existing in public dir
    // or directly by url /_m8/generyte/build/my_path

    const req_path   = req.path
    const clean_path = req_path.replace(/^\/_m8\/cegenerator\/build/, '')
    let searchpath   = clean_path.replace(/\/+/g, '/')
    const slashRegex = /\/$/g
    const htmlRegex  = /\.html$/g
    const slashEnd   = searchpath.match(slashRegex)? true : false
    const htmlEnd    = searchpath.match(htmlRegex)? true :false
    console.log("GENERATOR GENERATE")
    console.log('    req_path', req_path)
    console.log('    clean_path', clean_path)
    console.log('    searchpath', searchpath)
    console.log('    slashEnd', slashEnd)
    console.log('    htmlEnd', htmlEnd)

    // ----------------------------------------------------
    // index.html is always redirectd to slash:
    const regex1 = /\/index\.html$/g
    const found1 = req_path.match(regex1)
    if(found1) {
      let redirect_path = ''
      console.log("    REQUESTED an INDEX")
      redirect_path = req_path.replace(regex1, '/')
      console.log("    NEW REDIRECT PATH", redirect_path)
      res.redirect(redirect_path)
      return
    }

    // ----------------------------------------------------
    // no \.html$ ending is always redirectd to slash:
    if(! slashEnd && ! htmlEnd) {
      let redirect_path = req_path + '/'
      console.log("    REQUESTED NO_HTML and NO_SLASH")
      console.log("    NEW REDIRECT PATH", redirect_path)
      res.redirect(redirect_path)
      return
    }

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // 1/2 EJS VIEW
    let suffix = '.ejs'
    if(slashEnd) { suffix = 'index.ejs'}
    let source_ejs = views_dir + searchpath + suffix
    let render_ejs = searchpath + suffix
    // render without leading slash:
    render_ejs = render_ejs.substring(1)
    console.log("    TESTing for ejs_file:", source_ejs)
    if (fs.existsSync(source_ejs)) {
      console.log("    -> resource_type === view")
      let output_file  = output_dir + searchpath
      let generate_dir = output_dir + searchpath
      if(slashEnd) {
        output_file = output_file + 'index.html'
      }
      else {
        // generate_dir
        // need to remove last part from generate_dir, because this is file
        let path_array = generate_dir.split("/")
        let create_dir = generate_dir.slice(0,-1).join('/')
        console.log("        create_dir", create_dir)
        if (! fs.existsSync(create_dir)) {
          console.log(`        Creating directory ${create_dir}.`);
          fs.mkdirSync(create_dir, { recursive: true });
        }
      }
      console.log("        source_ejs:   " + source_ejs)
      console.log("        render_ejs:   " + render_ejs)
      console.log("        generate_dir: " + generate_dir)
      console.log("        output_file:  " + output_file)
      // mkdir
      if (! fs.existsSync(generate_dir)) {
        console.log(`        Directory ${generate_dir} not found. Try to create...`);
        fs.mkdirSync(generate_dir, { recursive: true });
      }
      // 4. Respond and save file
      let myData = {}
      myData.siteconfig = global.__sitecfg
      res.render(render_ejs, myData, function(err, output) {
        res.send(output)
        if (err) {
          console.error(err);
        }
        fs.writeFile(output_file, output, err => {
          console.log("        writing to file", output_file)
          if (err) {
            console.error(err);
          }
        })
      })
    }
    else {
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // 2/2 NODE

      let nodeData
      let write_dir
      let write_file
      let ejs_template 
      let full_node_list  = []

      let myData = {}
      myData.page = {}
      myData.page.channel_articles = []
      myData.siteconfig = global.__sitecfg

      myData.page.verbose = 3
      if(searchpath === '') { searchpath = '/'}
      console.log("    TESTING for node", searchpath)

      // ####################################################
      // nodeData
      Node.findOne({ where: { path: searchpath } })
      .then( noderesult => {
        if(noderesult){
          console.log("    -> node found", searchpath)

          nodeData          = noderesult
          myData.node       = nodeData
          myData.page.title = nodeData.title
          
          // ejs_template + write_file
          if( nodeData.parentid === 0 ) {
            ejs_template = ejs_homepage
            write_file = output_dir + nodeData.path + 'index.html'
          }
          else if(nodeData.type === 'article') {
            ejs_template = ejs_article
            write_file = output_dir + nodeData.path
          }
          else {
            ejs_template = ejs_default
            write_file = output_dir + nodeData.path + 'index.html'
          }
          write_dir  = path.dirname(write_file)

          // ejs_template overwrite by specified layout
          if( nodeData.layout && nodeData.layout !== '') {
            let test_layout = '_layout/' + nodeData.layout + '.ejs'
            let test_fiile = views_dir + '/' + test_layout
            if ( fs.existsSync(test_fiile) ) {
              ejs_template = test_layout
            }
            else {
              console.log("    WARNING: can not find required layout", test_fiile)
            }
          }

          // target directory
          if (! fs.existsSync(write_dir)) {
            console.log(`        Directory ${write_dir} not found. Try to create...`);
            fs.mkdirSync(write_dir, { recursive: true });
          }

          // debug
          console.log("      resource_type   " , nodeData.type || 'ERR')
          console.log("      resource_id     " , nodeData.id || 'ERR')
          console.log("      parent_id     " , nodeData.parentid || 'ERR')
          console.log("      ejs_template   ", ejs_template || 'ERR')
          console.log("      write_file     ", write_file || 'ERR')
          console.log("      write_dir      ", write_dir || 'ERR')

          // ####################################################
          // channel_articles
          Node.findAll({ 
            where: { 
              parentid: nodeData.id, 
              type: 'article' 
            },
            order: [
              ['id', 'DESC']
            ]
          })
          .then( listresult => {
            if(listresult){
              // channel articles 
              myData.page.channel_articles = listresult
            }
            else {
              console.log("  ---> no related articles found")
            }
            // ####################################################
            // full_list (navi, breadcrumb)
            Node.findAll({ attributes: ['id', 'parentid', 'path', 'title'] })
            .then( full_list => {
              // Breadcrumb
              if(full_list) { 
                full_list.unshift(noderesult)
                // also: full list of all nodes
                full_node_list = full_list       
                myData.page.breadcrumb = breadcrumbBuilder.build(full_list)     
              }
              // ####################################################
              // element_list
              let element_mapping_list = []
              let element_mapping_data = []
              Element2Node.findAll({ 
                where: { 
                  nodeid: nodeData.id 
                },
                order: [
                  ['posrow', 'ASC'],
                  ['posnum', 'ASC']
                ]
              })
              .then( mappingResult => {
                if(mappingResult) {
                  console.log(JSON.stringify(mappingResult,null,4))
                  // for each element in mappingResult
                  // element_mapping_list.push(element.id)
                  for(let i=0; i<mappingResult.length; i++) { 
                    element_mapping_list.push(mappingResult[i].elementId)
                  }
                  console.log(element_mapping_list)
                }
                Element.findAll({ 
                  where: {
                    id: element_mapping_list
                  }
                })
                .then( elementData => {
                  // for each element in mappingResult
                  // mapping_data.push mappingResult id???
                  for(let i=0; i<element_mapping_list.length; i++) { 
                    for(let k=0; k<elementData.length; k++) { 
                      if(elementData[k].id == element_mapping_list[i]) {
                        let eData = {}
                        eData.id     = elementData[k].id
                        eData.content= elementData[k].content
                        eData.posrow = 1
                        eData.posnum = 1
                        element_mapping_data.push(eData)
                      } 
                    }
                  }
                  myData.element_mappings = element_mapping_data
                  // console.log('Element mappings:')
                  // console.log(JSON.stringify(myData.element_mappings, null, 4))
                  // -------------------
                  // TODO: Navigation
                  // -------------------
                  myData.page.navigation = navigationBuilder.build(full_node_list)
                  // console.log(  "-> " + JSON.stringify(myData.page.breadcrumb, null, 4) )
                  // console.log( "->" + JSON.stringify(myData.page.element_mappings, null, 4) )
                  // render
                  res.render(ejs_template, myData, function(err, output) {
                    res.send(output)
                    if (err) {
                      console.error(err);
                    }
                    console.log("        write_dir", write_dir)
                    console.log("        write_file", write_file)
                    fs.writeFile(write_file, output, err => {
                      console.log("        writing to file", write_file)
                      if (err) {
                        console.error(err)
                      }
                    }) // end write file
                  }) // end render
                }) // end select elements
              })// end element2node
            }) // end full list
          }) // end find_all parentid
        } // end if has one
      }) // end of find one
    } // end of else if not exists ejs_file
  } // generate
} // generator

export default generator
