
function routes(config) {
    app = config.app;
    checkSession = config.checkSession;
    query = config.query;
    io = config.io;


    app.get('/', function (req, res) {
        res.send('hello world!')
    });//end '/'



    //Registration 
    app.get('/registration', checkSession, function (req, res) {
        if (app.get('env') === 'development'){
            res.render('registration', { message: "hello world", socketName: "http://localhost" })
        }
        else{
            res.render('registration', { message: "hello world", socketName: "https://kings-club.herokuapp.com/" })
        }
        
    })

    app.post('/registration', checkSession, function (req, res) {
        if(!req.body.adultNames || !req.body.childNames){
            res.send('please fill in at least one adult and one child name')
        }
        else{
//console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
        // adultNames = req.body.adultNames.split(',');
        // childNames = req.body.childNames.split(',');
        //console.log(req.body.adultNames[0]);
         adultNames = JSON.parse(req.body.adultNames)
         for(let item =0; item < adultNames.length; item++){
             adultNames[item][1] = adultNames[item][1].toLowerCase();
         }
         childNames = JSON.parse(req.body.childNames)
         for(let item =0; item < childNames.length; item++){
            childNames[item][1] = childNames[item][1].toLowerCase();
        }
console.log(adultNames)
console.log(childNames)
        //prep for crazy callback awesomeness


     
        let adultIDs = [];
        let childIDs = [];
        let InsertAdultCounter = 0;
        let InsertChildCounter = 0;

        for (i = 0; i < adultNames.length; i++) {
            if(adultNames[i][0] == ""){
                let text = 'INSERT INTO adult (adult_name) VALUES ($1) ON CONFLICT (adult_name) DO UPDATE SET adult_name = $1 RETURNING *'
                let values = [adultNames[i][1]];
                query(text, values, callback);
                function callback(data) {
                    if (InsertAdultCounter < adultNames.length) {
                        adultIDs.push(data.rows[0].adult_id);
                        InsertAdultCounter++;
                        
                        if(InsertAdultCounter == adultNames.length){
                            step2();
                        }
                       
    
                    }
                  
                };//end call back  
            }//end if
            else{
                let text = 'INSERT INTO adult (adult_name,adult_photo) VALUES ($1,$2) ON CONFLICT (adult_name) DO UPDATE SET adult_photo = $2 RETURNING *'
                let values = [adultNames[i][1],adultNames[i][0]];
            query(text, values, callback);
            function callback(data) {
                if (InsertAdultCounter < adultNames.length) {
                    adultIDs.push(data.rows[0].adult_id);
                    InsertAdultCounter++;
                    
                    if(InsertAdultCounter == adultNames.length){
                        step2();
                    }
                   

                }
              
            };//end call back  
        }//end else
        };//end for loop

        function step2() {
            console.log('completed adult database updates');

            for (i = 0; i < childNames.length; i++) {

                if(childNames[i][0] == ""){
                let text = 'INSERT INTO child (child_name) VALUES ($1) ON CONFLICT (child_name) DO UPDATE SET child_name = $1 RETURNING *';
                let values = [childNames[i][1]];
                query(text, values, callback);
                function callback(data) {

                    if (InsertChildCounter < childNames.length) {
                        childIDs.push(data.rows[0].child_id);
                        InsertChildCounter++;
                        if(InsertChildCounter == childNames.length){
                            step3();
                        }
                    }
                    else {
                      //  step3();
                    };//end else
                };//end callback
            }//end if photo blank
            else{
                let text = 'INSERT INTO child (child_name , child_photo) VALUES ($1,$2) ON CONFLICT (child_name) DO UPDATE SET child_photo = $2 RETURNING *';
                let values = [childNames[i][1],childNames[i][0]];
                query(text, values, callback);
                function callback(data) {

                    if (InsertChildCounter < childNames.length) {
                        childIDs.push(data.rows[0].child_id);
                        InsertChildCounter++;
                        if(InsertChildCounter == childNames.length){
                            step3();
                        }
                    }
                    else {
                      //  step3();
                    };//end else
                };//end callback
            }//end else
            };//end for
        };//end step 2

        function step3() {
            console.log('completed child database updates')
            let step3Counter = 0;
            let AdultAndChildNum = adultIDs.length * childIDs.length;
        
            for (let i = 0; i < adultIDs.length; i++) {
              

                for (j = 0; j < childIDs.length; j++) {
  
                    // Below is how one does a many to many insertion
                    let text = 'INSERT INTO adult_child (adult_id, child_id) SELECT $1, $2 WHERE NOT EXISTS (SELECT * FROM adult_child WHERE adult_id = $1 AND child_id = $2)';
                    let values = [adultIDs[i], childIDs[j]];
                    query(text, values, callback)
                    function callback(data) {
                        if (step3Counter < AdultAndChildNum) {
                            step3Counter++;
                            if(step3Counter == AdultAndChildNum){
                                step4();
                            }
                        }
                
                    }//end call back

                }//end child for loop

            }//end adult for loop

        }//end step 3
function step4(){
    console.log('junction table updates complete')
    res.send('complete')
}//end step 4
        }//end else for checking names are submitted
 //   }//end STEP 0
    }); //end REGISTRATION POST













}//end routes

module.exports = routes;  //VS code wants to change this to ES6, but the support does not seem to be their yet. Will just have to wait. 