var express = require('express');
var router = express.Router();
var path = require('path');

var formidable = require('formidable');
var fs = require('fs');
var unzip = require('unzip');
const cuid = require('cuid');
var sitesManager = require('../code/managers/SitesManager');

/* GET home page. */
//router.get('/:id', function(req, res, next) {
//  res.render('index', { title: 'Express' , age:req.params.id });
//});

router.get('/', function(req,res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});


router.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '../uploads');


  console.log(form.uploadDir);
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    var zipFilePath = path.join(form.uploadDir, file.name);
    var uuid = cuid();
    var extractPath = path.join(form.uploadDir, uuid);
    fs.renameSync(file.path, zipFilePath);
    fs.createReadStream(zipFilePath).pipe(unzip.Extract({ path: extractPath }));


    var createDate = new Date();
    var dueDate = new Date();
    dueDate.setTime(dueDate.getTime() + 7 * 86400000);

    var site = {
      virtualPath : '/' + uuid,
      physicalPath: extractPath,
      uuid : uuid,
      createDate : createDate,
      dueDate : dueDate
    };

    sitesManager.saveSite(site);
    form.siteId = uuid;
  });

  form.on('field', function(name, value) {
    console.log(' name: ' + name + ' value: ' + value);
  });

      // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end(form.siteId);
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

router.get('/saveSiteOwner', function(req, res){
  var siteId = req.query.siteId;
  var ownerEmail = req.query.ownerEmail;

  sitesManager.saveSiteOwner(siteId,ownerEmail);

  res.sendStatus(200);
});


//router.get('/', function(req,res) {
//  res.send({a: 'helloworld'});
//});

module.exports = router;
