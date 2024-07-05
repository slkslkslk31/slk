'use strict';

var express = require('express');
var cors = require('cors');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
// require and use "multer"...
var runner  = require('./test-runner');
var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post("/api/fileanalyse", upload.single('upfile'), function(req, res){ 
  console.log(req.file.originalname)
  console.log(JSON.stringify({"name": req.file.originalname, "size": req.file.size, "type": req.file.mimetype}))
  res.json({"name": req.file.originalname,  "type": req.file.mimetype ,"size": req.file.size});
  
});


app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
    if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});
module.exports = app; //for testing