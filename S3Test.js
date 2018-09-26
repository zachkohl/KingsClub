function routes(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    const aws = require('aws-sdk');
    aws.config.region = 'US West (Oregon)';
const S3_BUCKET = process.env.S3_BUCKET;

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
        url: stringcat
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
  });





























}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 