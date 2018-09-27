function routes(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    const aws = require('aws-sdk');
    aws.config.region = 'us-west-2';
const S3_BUCKET = process.env.S3_BUCKET || 'kings-club';

app.get('/S3Test', checkSession, function (req, res) {
    res.render('S3Test')
})


app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
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

//   var s3 = new aws.S3(); //access is given based on the credentials stored elsewhare on the computer. 
//   var myBucket = 'kings-club'; //name of bucket

//   var myKey = 'txt'; //what the thing will be
  
  
//    params = {Bucket: myBucket, Key: myKey, Body: 'Valueeee or some data' };
  
//        s3.putObject(params, function(err, data) {
  
//            if (err) {
  
//                console.log(err)
  
//            } else {
  
//                console.log("Successfully uploaded data to myBucket/myKey");
  
//            }
  
//         });

//The above actually works. Key is having the correct credentials put into C:\Users\Zach\.aws\credentials
























}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 