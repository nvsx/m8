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
 
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // 1/3 EJS VIEW
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
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

      let breadcrumb = []
      
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // 2/3 CONTAINER
      // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      console.log("    TESTing for container")
      let globalArray = []
      Node.findAll({
        attributes: ['id', 'parentid', 'title', 'path']
      })
      .then( fullResult => {
        globalArray = fullResult
      })
      Node.findOne({ where: { path: searchpath, type: 'container' } })
      .then(noderesult => {
        if(noderesult){
          let source_node = noderesult
          console.log("    -> resource_type === container")
          let write_dir  = output_dir + noderesult.path
          let write_file = write_dir + 'index.html'
          if (! fs.existsSync(write_dir)) {
            console.log(`        Directory ${write_dir} not found. Try to create...`);
            fs.mkdirSync(write_dir, { recursive: true });
          }
          if(noderesult.parentid && noderesult.parentid !== 0) {
            let thisParent = noderesult.parentid
            let breadcrumbIndex = 0
            while(breadcrumbIndex < globalArray.length) {
              let thisEntry = globalArray[breadcrumbIndex]
              console.log(" "+ breadcrumbIndex + " " + thisEntry.title)
              if(thisParent === thisEntry.id ) {
                breadcrumb.unshift(thisEntry)
                console.log(thisEntry.title)
              }
              breadcrumbIndex = breadcrumbIndex +1
            }
          }
          let myData = {}
          myData.page = {}
          myData.page.verbose = 2   
          myData.container = noderesult
          myData.siteconfig = global.__sitecfg
          myData.container.title = noderesult.title
          myData.container.content = noderesult.content
          myData.page.channel_articles = []
          Node.findAll({ where: 
            { 
              parentid: noderesult.id, 
              type: 'article' 
            },
            order: [
              ['id', 'DESC']
            ],
          })
          .then( listresult => {
            if(listresult){
              //   console.log(JSON.stringify(listresult, null, 2))
              myData.page.channel_articles = listresult
            }
            else {
              console.log("  ---> no related articles found")
            }
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
          })
        } else {

          // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          // 3/3 ARTICLE
          // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          console.log("    testing for article")
          Node.findOne({ 
            where: { 
              path: searchpath, 
              type: 'article' 
            } 
          })
          .then(articleresult => {
            if(articleresult) {
              let source_article = articleresult
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
              myData.page = {}
              myData.page.verbose = 2
              myData.siteconfig = global.__sitecfg
              myData.article = articleresult     
              let myChannelId = 0
              let ChannelData = {}
              myChannelId = myData.article.channel
              console.log("    ---------> searching for channel", myChannelId)
              Node.findByPk(myChannelId)
              .then(noderesult => {
                if(noderesult){
                  ChannelData = noderesult
                  console.log("    ---------> YESSS_NODE")
                }
                else {
                  console.log("    ---------> NO_NODE")
                }
                console.log("    ---------> noderesult", JSON.stringify(ChannelData,null,2))
                myData.channel = ChannelData
                myData.page.breadcrumb = breadcrumb
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