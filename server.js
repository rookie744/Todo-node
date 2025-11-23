require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {Todo,UserModel} = require('./schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');



app.set('view engine','ejs');
app.use(express.urlencoded());
app.use(express.static('Public'));
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            app.listen(process.env.PORT,() =>{
            console.log('Server Started at the port',process.env.PORT);
            console.log('✅ Connected to MongoDB Atlas');
            })
        })
        .catch((err) => console.log(err));

app.get('/',async (req,res) => {
    const authValues = req.cookies.authValues || false;
    const checktoken = authValues ? jwt.verify(authValues.token,process.env.JWT_SECRET_ID) : false;
    const getuser = checktoken ? await UserModel.findOne({username : authValues.username}) : false;
    console.log(getuser);
    console.log(authValues);
    if(getuser){
    if (checktoken && getuser.username === authValues.username && getuser.password === authValues.password){
    Todo.find().sort({createdAt : -1})
        .then((result) => {
            res.render('index',{todos:result,auth : req.cookies.authValues});
            })
        .catch((err) => res.send(err));
        }
        else{
            res.clearCookie('authValues');
            res.render('login');

        }
    }
        else{
            res.clearCookie('authValues');
            res.render('login');
        }
});

app.post('/add',(req,res) => {
    // console.log(req);
    const todotext = new Todo(req.body);;
    todotext.save()
            .then(() => res.redirect('/'))
            .catch((err) => res.send(err));
});

app.get('/register',(req,res) => {
    res.render('register');
});

app.post('/register',async (req,res) => {
    var {username,password} = req.body;
    hashpassword = await bcrypt.hash(password,10);
    const user = new UserModel ({
        username,password:hashpassword
    });
    user.save()
        .then(() => res.redirect('/'))
        .catch((err) => console.log(err));
});

app.get('/login',(req,res) => {
    res.render('login');
});

app.post('/login',async (req,res) => {
    const {username,password} = req.body;
    const user = await UserModel.findOne({username});
    // console.log('Found',user); 
    const password_match = await bcrypt.compare(password,user.password);
    // console.log(password_match); 
    if(password_match)
    {
        // res.redirect('/');
        const token = jwt.sign({userId : user._id},process.env.JWT_SECRET_ID,{expiresIn : '1h'});
        res.cookie('authValues',{
            username : user.username,
            password : user.password,
            token
        });
        res.redirect('/');
    }
    else
    {
        res.clearCookie('authValues');
        res.send('404');
    }
});

app.put('/update/:id/:status',(req,res) => {
    // console.log(req.params.status);
    Todo.findByIdAndUpdate(req.params.id , {status : req.params.status})
        .then ((result) => {res.json({
            redirect : '/'
        })
    })
        .catch(err => console.log(err));
});

app.delete('/delete/:id',(req,res) => {
    Todo.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.json({
                redirect : '/'
            })
        })
        .catch((err) => console.log(err));
})


app.use((req,res) => {
    res.send('404');
});