// import fs from 'fs'
// const statustest_verbose = 2
// const session_dir       = __config.system.session_dir

const generator = {
  generate: function (req, res) {
    // --- 1 ---
    // get path
    // lookup path in database
    // 404 if not found
    const req_path = req.path

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

    var locals = {
      title: 'title by generator ' + req_path,
      description: 'description by generator',
      header: 'Page Header by generator',
      text: 'Hello and welcome says the Generator!',
      date: new Date()
    };
    console.log(req.path + ' _ ' + new Date())
    res.render('m8/cd/generator', locals)
  }
}

export default generator
