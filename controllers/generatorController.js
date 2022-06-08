import fs from 'fs'

const file_root_dir = '../public'

const generator = {
  generate: function (req, res) {
    const req_path = req.path
    console.log(req_path)

    // 1. build redirect?
    let redirect_path = ''

    const regex1 = /\/index\.html$/g
    const found1 = req_path.match(regex1)
    if(found1) {
      console.log("    FOUND an INDEX")
      redirect_path = req_path.replace(regex1, '/')
      console.log("    NEW REDIRECT PATH", redirect_path)
    }
    else {
      const regex2 = /\/$/g
      const found2 = req_path.match(regex2)
      if(! found2) {
        redirect_path = req_path + '/'
      }
    }

    // 2. redirect or file
    if( redirect_path !== '') {
      console.log("  redirect_to", redirect_path)
      res.redirect(redirect_path)
    }
    else {
      // let ejs_file = ejspages_dir + req_path + 'index.ejs'
      // let ejs_file = 'm8/cd/generator'
      let file_path = file_root_dir + req_path
      let html_file = file_path + 'index.html'
      const rxa = /\/$/
      let file_dir = file_path.replace(rxa, '')

      console.log("    file_dir: " + file_dir)
      console.log("    file_path: " + file_path)
      console.log("    html_file: " + html_file)


      let ejs_file = req_path + 'index.ejs'
      const rx = /^\//
      ejs_file = ejs_file.replace(rx, '')
      console.log("    ejs_file: " + ejs_file)

      if (! fs.existsSync(file_dir)) {
        console.log(`    Directory ${file_dir} not found.`);
        fs.mkdirSync(file_dir, { recursive: true });
      }

      // 3. 404
      // if ! ejs_file: -> error 404

      // 4. deliver file
      // --- 2 ---
      // read and set all data
      // use layout to generate html
      // -- SELECT * FROM m8_nodes WHERE full_path = req_path
      // --- 3 ---
      // if cache_mode === 1
      // generate a file and place it in public dir
      // --- 4 ---
      // send response
      // (1)
      // https://www4.example.com/articles?filter=something
      // console.log(req.protocol)     // "https"
      // console.log(req.hostname)     // "example.com"
      // console.log(req.path)         // "/articles"
      // console.log(req.originalUrl)  // "/articles?filter=something"
      // console.log(req.subdomains)   // "['www4']"
      
      let locals = {
        title: 'title by generator ' + req_path,
        description: 'description by generator',
        header: 'Page Header by generator',
        text: 'Hello and welcome says the Generator!',
        date: new Date()
      };

      res.render(ejs_file, {}, function(err, output) {
        res.send(output)
        if (err) {
          console.error(err);
        }
        fs.writeFile(html_file, output, err => {
          console.log("    TODO! writing to file", html_file)
          if (err) {
            console.error(err);
          }
        })
      })
    }
  }
}

export default generator
