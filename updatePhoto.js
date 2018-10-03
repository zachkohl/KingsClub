
function routes(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    io = config.io;


    var selectedforPhoto = null;






    //Registration 
    app.get('/updatePhoto', checkSession, function (req, res) {
        if (app.get('env') === 'development'){
            res.render('updatePhoto', { message: "Update Photo", socketName: "http://localhost" })
        }
        else{
            res.render('updatePhoto', { message: "Update Photo", socketName: "https://kings-club.herokuapp.com/" })
        }
        
    })

    app.post('/updateAdultPhoto', checkSession, function (req, res) {

        if(!req.body.adultNames){
            res.send('please fill in name')
        }
        else{
            if(!req.body.adultPhoto){
                res.send('please take picture')
            }else{

            
            let text = 'UPDATE adult SET adult_photo = $1 WHERE adult_name = $2 RETURNING adult_name'
            let values = [req.body.adultPhoto,req.body.adultNames];
            query(text, values, callback);
            function callback(data) {
                if(typeof data.rows[0].adult_name === "undefined"){
                    res.send('something went wrong, maybe punctution')
                }
                if(data.rows[0].adult_name !=req.body.adultNames){
                    res.send('name not in database')
                }else{
                    res.send('update complete')
                }

                }//end callback
            }//end else
        }//end outer else
        


    }); //end update Adult POST

    app.post('/updateChildPhoto', checkSession, function (req, res) {

       
        if(!req.body.childNames){
            res.send('please fill in name')
        }
        else{
            if(!req.body.childPhoto){
                res.send('please take picture')
            }else{

            
            let text = 'UPDATE child SET child_photo = $1 WHERE child_name = $2 RETURNING child_name'
            let values = [req.body.childPhoto,req.body.childNames];
            query(text, values, callback);
            function callback(data) {
                if(typeof data.rows[0].child_name === "undefined"){
                    res.send('something went wrong, maybe punctution')
                }
                if(data.rows[0].child_name !=req.body.childNames){
                    res.send('name not in database')
                }else{
                    res.send('update complete')
                }

                }//end callback
            }//end else
        }//end outer else


    }); //end update Child POST



    
}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 