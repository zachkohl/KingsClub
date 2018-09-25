
function routes(config){
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;






app.get('/',function(req, res) {
    res.send('hello world!')
    });//end '/'



app._router.stack.forEach(function(routes){
    if(routes.route && routes.route.path){
        console.log(routes.route.path)
    }
});






}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 