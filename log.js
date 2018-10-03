
function routes(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    io = config.io;
    const fs = require('fs'); //because we want to write static files. 

 



    //log 
    app.get('/log', checkSession, function (req, res) {
       
      
        
       // let text = 'SELECT SIGNIN_CHILD_NAME, SIGNIN_INTIME, signout_intime FROM signin FULL JOIN signout on signin_child_name = signout_child_name'
       let text = 'SELECT SIGNIN_CHILD_NAME, SIGNIN_INTIME FROM signin'
        let values = [];
    query(text, values, callback);
    function callback(data) {
        PGtoCSV(data.rows,"./static/log.csv")
        function PGtoCSV(rows,filepathAndName) {
            headerArray = tableHeader(rows[0]);
            let forFile =JSON.stringify(headerArray);
            string = '';
          
            for (let i= 0; i < headerArray.length; i++){
              string = string + headerArray[i].toUpperCase() + ',';
            }
            string = string + "\r\n"
            for (let i = 0; i <rows.length; i++){
              for (let k = 0; k < headerArray.length; k++){
              string = string + rows[i][headerArray[k]] + ',';
              }
              string = string + '\r\n';
            }
            fs.writeFile(filepathAndName, string, (err) => { //https://nodejs.org/docs/latest/api/fs.html#fs_file_system
              if (err) throw err;
              console.log('The file has been saved!');  
              res.download('./static/log.csv','kingsclublog.csv')
          })
          }; //end of function
      
    };//end call back  
    })

    function tableHeader(row1) {
        if (row1){
        string = JSON.stringify(row1)
      
        string = string.slice(1,(string.length-1)); //cuts off the { } from each end. 
        string = string.replace(/"/g,''); //using the global variable of Regular Expressions
        console.log(string)
        toArray = string.split(',')
        let HeaderArray = [];
        for (let i = 0; i < toArray.length; i++){
          toArray[i] = toArray[i].split(':')
          HeaderArray[i] = toArray[i][0]
        }
        console.log(HeaderArray)
        return HeaderArray;
      }
      else{
        process.stdout.write('Error: data must have at least one row populated')
          } 
      }//end function

    



}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 