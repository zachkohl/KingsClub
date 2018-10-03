
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

//https://socket.io/docs/rooms-and-namespaces/
// io.on('connection', function (socket) {
//   socket.emit('severTransmit', { hello: 'world' }); //emit is the transmission method, first argument is the event name, second argument is the data https://socket.io/docs/server-api/#socket-emit-eventName-%E2%80%A6args-ack
//   socket.on('clientTransmit', function (data) { //On this event, preform said function. 
//     console.log(data.data);
//     selectedforPhoto = data.data;
//   });
// });




app.get('/camera',checkSession, function(req, res) {
    res.render('camera');
    var url = s3.getSignedUrl('getObject', {Bucket: S3_BUCKET,Key: 'output.jpeg', Expires: 60});
console.log('The URL is', url);
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
sharp(req.files.sampleFile.data).resize(null, 300).rotate(90).toBuffer( function(err, data, info) {
  if(err){
      console.log(err)
  }
  var photo = data;
  let text = 'SELECT * FROM picturecounter WHERE picturecounter_id = 1';
  let values = [];
  query(text, values, callback)
  function callback(data) {
    console.log(typeof data.rows[0].picturecounter_int)
let integer = data.rows[0].picturecounter_int;
console.log(integer);
integer++;
console.log(integer);
let text = 'UPDATE picturecounter SET picturecounter_int = $1 WHERE picturecounter_id = 1';
let values = [integer];
query(text, values, callback)
function callback() {
  console.log(integer);
  var myKey = 'picture'+integer+'.jpeg'; //what the thing will be
  params = {Bucket: S3_BUCKET, Key: myKey, Body: photo };
  
  s3.putObject(params, function(err, data) {

      if (err) {

          console.log(err)

      } else {
         io.sockets.emit('photo',myKey)
          console.log("Successfully uploaded data to myBucket/myKey");

      }

   });//end s3.putObject
res.redirect('/camera');

}//end inner call back

  }//end call back
  

  }); //end sharp
});//end post
//To do pre-signed URL: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
//https://stackoverflow.com/questions/37431757/pass-files-from-amazon-s3-through-nodejs-server-without-exposing-s3-url

app.get('/getS3signed', (req, res) => {
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
  };

  s3.getSignedUrl('getObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    stringcat = '`https://'+S3_BUCKET+'.s3.amazonaws.com/'+fileName
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});


}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 