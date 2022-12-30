var express = require('express');
var app = express(); 
const PORT = process.env.PORT || 3030;
var path = require('path');
var alert = require('alert');
var MongoClient = require('mongodb').MongoClient;
var MongoStore = require('connect-mongo');
var session  = require('express-session');
const { render } = require('ejs');
var db;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
}));

MongoClient.connect ("mongodb://127.0.0.1:27017/myDB", function (err, client) {
  if (err) throw err;
  db = client.db('myDB');
});

//--------------GET REQUESTS----------------

app.get('/', function(req,res){ //getting the first page
  res.render('login')
});

app.get('/login', function(req,res){
  res.render('login')
  console.log(req.session.log)
})

app.get('/registration' , function(req,res){ //getting the registration page
  res.render('registration')
})

app.get('/home', function(req,res){
  if(req.session.log){
    res.render('home')
  }
  else{
    res.redirect('login')
  }
})

app.get('/hiking' , function(req,res){ //user clicks hiking -> directs to hicking page
  if(req.session.log){
    res.render('hiking')
  }
  else{
    res.redirect('login')
  }
})

app.get('/cities' , function(req,res){ //user clicks cities -> directs to cities page
  if(req.session.log) {
    res.render('cities')
  }
  else{
    res.redirect('login')
  }
})

app.get('/islands' , function(req,res){ //user clicks islands -> directs to islands page
  if(req.session.log){
    res.render('islands')
  }
  else{
    res.redirect('login')
  }
})

app.get('/inca' , function(req,res){ //user clicks inca -> directs to inca page
  if(req.session.log){
    res.render('inca')
  }
  else{
    res.redirect('login')
  }
})

app.get('/annapurna' , function(req,res){ //user clicks annapurna -> directs to annapurna page
  if(req.session.log){
    res.render('annapurna')
  }
  else{
    res.redirect('login')
  }
})

app.get('/paris' , function(req,res){ //user clicks paris -> directs to paris page
  if(req.session.log){
    res.render('paris')
  }
  else{
    res.redirect('login')
  }
})

app.get('/rome' , function(req,res){ //user clicks rome -> directs to rome page
  if(req.session.log){
    res.render('rome')
  }
  else{
    res.redirect('login')
  }
})

app.get('/bali' , function(req,res){ //user clicks bali -> directs to bali page
  if(req.session.log){
    res.render('bali')
  }
  else{
    res.redirect('login')
  }
})

app.get('/santorini' , function(req,res){ //user clicks santorini -> directs to santorini page
  if(req.session.log){
    res.render('santorini')
  }
  else{
    res.redirect('login')
  }
})

app.get('/wanttogo' , async function(req,res){ //user clicks wanttogo -> directs to wanttogo page
  if(req.session.log){
    const currentUserData = await db.collection('myCollection').findOne({username: req.session.username})
    console.log(currentUserData)
    res.render('wanttogo', {data : currentUserData });
  }
  else{
    res.redirect('login')
  }
})

//--------------POST REQUESTS----------------

//login page post method
app.post('/login', async function (req,res){
  if((req.body.username === 'admin') && (req.body.password === 'admin')){
    req.session.log = true
    res.redirect('home')
    console.log(req.session.log)
  }
  else{
    const{username,password} = req.body
    req.session.username = req.body.username;
    const user = await db.collection('myCollection').findOne({ username: username })
    if(user != null){
      if( user.password == password){
        req.session.log = true
        res.render('home')
      }
      else{
        alert("Enter valid credentials")
        res.redirect('back')
      }
    }
    else{
      alert("Enter valid credentials")
      res.redirect('back')
  }
  }
})

app.post('/register', async function(req,res){
  const{username,password} = req.body
  const usernameCheck = await db.collection('myCollection').findOne({username:username})
  if(usernameCheck == null){
    const user = {username: req.body.username, password: req.body.password, wantogolist: []};
    db.collection('myCollection').insertOne(user)
    alert("Registration Successful")
    console.log('username: ', username)
    console.log('password: ', password)
    res.redirect('login')
  }
  else{
   alert("Username already taken\nPlease enter another one")
   res.render('registration')
  }
})

app.post('/addtowanttogoAnnapurna' , async function(req,res){
  const checkList = await db.collection('myCollection').findOne({ username: req.session.username, wantogolist: "annapurna" })
  if(checkList == null){
    db.collection('myCollection').findOneAndUpdate(
      {
        username: req.session.username,
      },
      {
        $push:{
          wantogolist: 'annapurna'
        }
      }
    )
    res.redirect('back')
  }
  else{
    alert("already in your want to go list")
    res.redirect('back')
  }
})

app.post('/addtowanttogoInca' ,async function(req,res){ 
  const checkList = await db.collection('myCollection').findOne({ username: req.session.username, wantogolist: "inca" })
  if(checkList == null){
    db.collection('myCollection').findOneAndUpdate(
      {
        username: req.session.username,
      },
      {
        $push:{
          wantogolist: 'inca'
        }
      }
    )
    res.redirect('back')
  }
  else{
    alert("already in your want to go list")
    res.redirect('back')
  }
})

app.post('/addtowanttogoParis' ,async function(req,res){
  const checkList = await db.collection('myCollection').findOne({ username: req.session.username, wantogolist: "paris" })
  console.log(checkList);
  if(checkList === null){
    db.collection('myCollection').findOneAndUpdate(
      {
        username: req.session.username,
      },
      {
        $push:{
          wantogolist: 'paris'
        }
      }
    )
    res.redirect('back')
  }
  else{
    alert("already in your want to go list")
    res.redirect('back')
  }
})

app.post('/addtowanttogoRome' ,async function(req,res){
  const checkList = await db.collection('myCollection').findOne({ username: req.session.username, wantogolist: 'rome' })
  if(checkList == null){
    db.collection('myCollection').findOneAndUpdate(
      {
        username: req.session.username,
      },
      {
        $push:{
          wantogolist: 'rome'
        }
      }
    )
    res.redirect('back')
  }
  else{
    alert("already in your want to go list")
    res.redirect('back')
  }
})

app.post('/addtowanttogoSantorini' ,async function(req,res){
  const checkList = await db.collection('myCollection').findOne({ username: req.session.username, wantogolist: "santorini" })
  if(checkList == null){
    db.collection('myCollection').findOneAndUpdate(
      {
        username: req.session.username,
      },
      {
        $push:{
          wantogolist: 'santorini'
        }
      }
    )
    res.redirect('back')
  }
  else{
    alert("already in your want to go list")
    res.redirect('back')
  }
})

app.post( '/addtowanttogoBali' ,async function(req,res){
  const checkList = await db.collection('myCollection').findOne({ username: req.session.username, wantogolist: "bali" })
  if(checkList == null){
    db.collection('myCollection').findOneAndUpdate(
      {
        username: req.session.username,
      },
      {
        $push:{
          wantogolist: 'bali'
        }
      }
    )
    res.redirect('back')
  }
  else{
    alert("already in your want to go list")
    res.redirect('back')
  }
})

app.post ('/search',function(req,res){
  const pages = ["paris", "santorini", "rome", "bali", "annapurna",
    "inca", "wantogo", "home", "islands", "cities", "hiking", "searchresults"];

  const data = req.body.Search
  const searchLetters = data.toLowerCase()

  var result = new Array()
  pages.forEach( page => {
    if (page.includes(searchLetters))
      result.push(page); 
  });

res.render('searchresults',{ destinations : result })

});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
