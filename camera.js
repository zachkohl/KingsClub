
function routes(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    io = config.io;
    var sharp = require('sharp');
    const aws = require('aws-sdk');
    aws.config.region = 'us-west-2';
const S3_BUCKET = process.env.S3_BUCKET || 'kings-club';
var s3 = new aws.S3(); //access is given based on the credentials stored elsewhare on the computer. 



app.get('/camera',checkSession, function(req, res) {
    res.render('camera');
})

app.post('/camera',checkSession, function(req, res){
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 console.log('got here')
  // Use the mv() method to place the file somewhere on your server

//  sharp(req.files.sampleFile.data).resize(200, 300).rotate(90).toFile('output.jpeg', function(err) {
//           if(err){
//               console.log(err)
//           }
sharp(req.files.sampleFile.data).resize(200, 300).rotate(90).toBuffer( function(err, data, info) {
  if(err){
      console.log(err)
  }
  var myKey = 'output.jpeg'; //what the thing will be
  
  
   params = {Bucket: S3_BUCKET, Key: myKey, Body: data };
  
       s3.putObject(params, function(err, data) {
  
           if (err) {
  
               console.log(err)
  
           } else {
  
               console.log("Successfully uploaded data to myBucket/myKey");
  
           }
  
        });
    res.redirect('/camera');
  });
});//end post






}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 