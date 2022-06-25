import fs      from 'fs'
import path    from 'path'
import Node    from '../models/Node.js'
import Article from '../models/Article.js'

const output_dir     = '../public'
const views_dir      = '../site/views'
const ejs_template   = '_site/layouts/default.ejs'
const article_layout = '_site/layouts/article_default.ejs'

const generator = {

  delete: function (req, res) {
    console.log("DELETE FILE FROM PUBLIC DIR")
    const req_path = req.path
    console.log("    delete request:", req_path)
    const calc_path = req_path.replace(/^\/_m8\/cegenerator\/delete/, output_dir)
    const delete_path = calc_path.replace(/\/$/, '/index.html')
    console.log("    delete file:", delete_path)
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
    const req_path = req.path
    const clean_path = req_path.replace(/^\/_m8\/cegenerator\/build/, '')
    let searchpath = clean_path.replace(/\/+/g, '/')
    console.log("--------------------")
    console.log("GENERATOR GENERATE")
    console.log('    req_path', req_path)
    console.log('    clean_path', clean_path)
    console.log('    searchpath', searchpath)
    // is this request file or dir?
    const slashRegex = /\/$/g
    const htmlRegex  = /\.html$/g
    const slashEnd = searchpath.match(slashRegex)? true : false
    const htmlEnd  = searchpath.match(htmlRegex)? true :false
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
    // Check what kind of page we have
    // there are three types: 1.view, 2.container, 3.article
    let source_node, source_article
    let resource_type = ''
    let suffix = '.ejs'
    if(slashEnd) { suffix = 'index.ejs'}
    let source_ejs = views_dir + searchpath + suffix
    let render_ejs = searchpath + suffix
    // render without leading slash:
    render_ejs = render_ejs.substring(1)

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // 1/3 EJS VIEW
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    console.log("    TESTing for ejs_file:", source_ejs)
    if (fs.existsSync(source_ejs)) {
      resource_type = 'view'
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
      // 2/3 CONTAINER
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      console.log("    TESTing for container")
      Node.findOne({ where: { path: searchpath } }).then(noderesult => {
        if(noderesult){
          source_node = noderesult
          resource_type = 'node'
          console.log("    -> resource_type === container")
          let write_dir  = output_dir + noderesult.path
          let write_file = write_dir + 'index.html'
          if (! fs.existsSync(write_dir)) {
            console.log(`        Directory ${write_dir} not found. Try to create...`);
            fs.mkdirSync(write_dir, { recursive: true });
          }
          let myData = {}
          myData.siteconfig = global.__sitecfg
          myData.title = noderesult.title
          myData.content = noderesult.content
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
                console.error(err);
              }
            })
          })
        } else {

          // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          // 3/3 ARTICLE
          // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          console.log("    testing for article")
          Article.findOne({ where: { path: searchpath } }).then(articleresult => {
            if(articleresult) {
              source_article = articleresult
              resource_type = 'article'
              console.log("    -> resource_type === article")
              let write_dir  = output_dir + path.dirname(articleresult.path)
              let write_file = output_dir + articleresult.path
              console.log("        write_dir", write_dir)
              console.log("        write_file", write_file)
              if (! fs.existsSync(write_dir)) {
                console.log(`        Directory ${write_dir} not found. Try to create...`);
                fs.mkdirSync(write_dir, { recursive: true });
              }
              let myData = {}
              myData.siteconfig = global.__sitecfg
              myData.title = articleresult.title
              myData.content = articleresult.content
              myData.pageData = articleresult
              res.render(article_layout, myData, function(err, output) {
                res.send(output)
                if (err) {
                  console.error(err);
                }
                fs.writeFile(write_file, output, err => {
                  console.log("        writing to file", write_file)
                  if (err) {
                    console.error(err);
                  }
                })
              })
            } 
            else {
              // no match of any kind
              console.log('    ERROR: Resource not found.')
              res.sendStatus(404)
              return
            }
          })
        }
      })
      .catch (err => {
        console.log(err)
        res.sendStatus(404)
      })
    }
  }
}

export default generator
