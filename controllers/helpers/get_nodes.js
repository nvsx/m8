
const getNodes = {
  getList: function(pageid, data, options) { 
    // return data
    let dataResult = []
    pageid = parseInt(pageid)
    if(! Number.isInteger(pageid)) {
      // Fallback: Get all nodes without parentid
      let dataIndex = 0
      while(dataIndex < data.length) {
        if(data[dataIndex].parentid === ''){ 
          dataResult.push(data[dataIndex])
        }
        dataIndex = dataIndex + 1
      }
      pageid=0
    }
    // console.log("    #######################################") 
    // console.log("    #### looking for parentid:", pageid)
    let dataIdx = 0
    while(dataIdx < data.length){
        // console.log("    #### this_pageid:", data[dataIdx].id)
        if( data[dataIdx].parentid === pageid){ 
            // console.log("    #### -> match, has_parentid:", data[dataIdx].parentid)
            dataResult.push(data[dataIdx])
            let thisId = data[dataIdx].id
            let add_list = getNodes.getList(thisId, data, {})
            if(add_list) {
              // console.log("    #### <<<<< adding_list")
              // console.log(JSON.stringify(add_list, null, 4))
              dataResult = dataResult.concat(add_list)
            }
        }
        dataIdx = dataIdx + 1
    }
    return dataResult
  }
}

export default getNodes
