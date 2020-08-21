var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var mysql = require('mysql');    
var conn = mysql.createConnection({ 
    host     : 'jaeheedb.cff8hc4ovoa9.us-east-1.rds.amazonaws.com',
    user     : 'admin',
    password : 'awsskinfosec',
    database : 'mydb'
});
var connd = mysql.createConnection({ 
  host     : 'jaeheedb-reple.cff8hc4ovoa9.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'awsskinfosec',
  database : 'mydb'
});
conn.connect();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', './views_mysql');
app.set('view engine', 'ejs');

app.get('/health', (req, res) => {
  res.status(200).send();
});

app.get('/Cars/add', function(req, res){ 
    var sql = 'SELECT * FROM Cars'; 
    connd.query(sql, function(err, cares, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error')
      }
        res.render('add', { cares: cares }); 
    });
});
app.post('/Cars/add', function(req, res){ 
    var car_serialNum = req.body.car_serialNum;
    var car_make = req.body.car_make;
    var car_model = req.body.car_model; 
    var car_year = req.body.car_year; 
    var car_color = req.body.car_color;
    var car_forsale = req.body.car_forsale;
    var sql = 'INSERT INTO Cars (car_serialNum, car_make, car_model, car_year, car_color, car_forsale) VALUES(?, ?, ?, ?, ?, ?)'; 
    var params = [car_serialNum, car_make, car_model, car_year, car_color, car_forsale]; 
    conn.query(sql, params, function(err, result, fields) { 
        if(err) {
          console.log(err);
          res.status(500).send('Internal Server Error'); 
        } else {
        console.log('The file has been saved!');
        res.redirect('/Cars/'+result.insertId);
        }
    });
});
app.get(['/Cars/:car_id/edit'], function(req, res){
    var sql = 'SELECT * FROM Cars';   
    connd.query(sql, function(err, cares, fields){
      var car_id = req.params.car_id;
      if(car_id){
        var sql = 'SELECT * FROM Cars WHERE car_id=?';
        connd.query(sql, [car_id], function(err, Cars, fields){
          if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('edit', {cares : cares, Cars : Cars[0] });
          }
        });
      } else {
        console.log(err);
        res.send('There is no car_id.');
      }
    });
});
app.post('/Cars/:car_id/edit', function(req, res){
    var sql = 'UPDATE Cars SET car_serialNum=?, car_make=?, car_model=?, car_year=?, car_color=?, car_forsale=? WHERE car_id=?'; 
    var car_serialNum = req.body.car_serialNum;
    var car_make = req.body.car_make;
    var car_model = req.body.car_model; 
    var car_year = req.body.car_year; 
    var car_color = req.body.car_color;
    var car_forsale = req.body.car_forsale;
    var car_id = req.params.car_id;
    conn.query(sql, [car_serialNum, car_make,  car_model, car_year, car_color, car_forsale, car_id], function(err, result, fields){
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/Cars/'+car_id)
      }
    });
});
app.get('/Cars/:car_id/delete', function(req, res){
    var sql = 'SELECT * FROM Cars'; 
    var car_id = req.params.car_id;
    connd.query(sql, function(err, cares, fields){
      var sql = 'SELECT * FROM Cars WHERE car_id=?'; 
      connd.query(sql, [car_id], function(err, Cars){
          if(err){
            console.log(err);
            res.status(500).send('Internal Sever Error');
          } else {
            if(Cars.length === 0){
              console.log('There is no record');
              res.status(500).send('Internal Sever Error');
            } else {
              res.render('delete', {cares:cares, Cars:Cars[0]});
            }
          }
      });
  });
});
app.post('/Cars/:car_id/delete', function(req, res){ 
    var car_id = req.params.car_id;
    var sql = 'DELETE FROM Cars WHERE car_id=?'; 
    conn.query(sql, [car_id], function(err, result){
      if(err) console.log(err);
      res.redirect('/Cars');
    });
});
app.get(['/Cars','/Cars/:car_id'], function(req, res)
{
    var sql = 'SELECT * FROM Cars'; 
    connd.query(sql, function(err, cares, fields)
    {
      var car_id = req.params.car_id; 
      if(car_id)
      {
        var sql = 'SELECT * FROM Cars WHERE car_id=?';
        connd.query(sql, [car_id], function(err, Cars, fields){
          if(err) 
          {
            res.status(500).send('Internal Server Error');
            console.log(err);
          } 
          else 
          {
            res.render('view', {cares:cares, Cars:Cars[0]});
          }
        });
      } 
      else 
      {
        res.render('view', {cares : cares, Cars : undefined })
      }
    });
});

app.listen(8000, function()
{
    console.log("Connected localhost:8000");
});
