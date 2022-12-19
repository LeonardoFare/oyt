const express=require('express');
const fs=require('fs');
const os=require('os');
const fileUpload=require('express-fileupload');
// const mongoose=require('mongoose');
require('dotenv').config();
const session=require('express-session');
const app=express();// some legacy browsers choke on 204
const passport=require('passport');

const cookieParser = require('cookie-parser');
const bodyParser=require('body-parser');
// const { stringify } = require('querystring');
const LocalStrategy=require('passport-local').Strategy;
//listening

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cookieParser());
// connection by mongodb
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
})
)
//session is good
// app.use(passport.initialize());
// app.use(passport.session());
const {MongoClient,ObjectId}=require('mongodb');

let dab;
// console.log(MongoClient)
// useNewUrlParser: true, useUnifiedTopology: true 
MongoClient.connect("mongodb://127.0.0.1:27017/people?directConnection=true")
.then(data=>{
    dab=data;
// let x=[];
    // dab.collection('urls').find().forEach(url=>{  urls.push(url)});   
http.listen(5000,'localhost',(err)=>{
    if(err)console.log(err,'here is the err');
    else console.log('we are responding on port 5000');

});
}).catch(err=>{
    console.log(err,'here is the err from the mongodb ');
})

// passport.use(new LocalStrategy({usernameField:'name'},(name,password,done)=>{
//     console.log(name,password,'here is the name and the password in the localStrategy');
//     for(let i=0;i<userss.length;i++){
//         if(userss[i]['name']===name&&userss[i]['password']===password){
//    console.log('i am in the if of the localStrategy',userss); 
//  return  done(null,userss[i]);    
//     }
//     else{
//         console.log('I am in the eles of the localStrategy')
//         return done(null,false);

//     }
// }}));

// passport.serializeUser((user,done)=>{
//     console.log(user,'i am in the passport.serializaion',userss)
//   return  done(null,user.name);
//   });
//   passport.deserializeUser((name,done)=>{
//     for(let i=0;i<userss.length;i++){
//         if(userss[i]['name']===name){
//         console.log(userss[i]['name'],name)
//            return done(null,userss); 
//         }
//     else
//        return done(null,false);
//     }
//   })
//connecting to mongodb ************************************************************

// mongoose.connect(process.env.MONGO_URL);
// ............................................................
// const schema=new mongoose.Schema({
//     url:{
//         type:String,
//         required:true,
//     }
// })




// let Url=new mongoose.model('urls',schema);

//**************************************************************************************************************************** 
// const { url } = require('inspector');
app.use(fileUpload({
    createParentPath: true,
}))
app.use(bodyParser.urlencoded({extended:false}))
app.set('trust proxy', true);
app.set("view engine", "ejs");
app.get('/find',(req,res)=>{
console.log(req.params.url,req.params);
console.log(req.query,req.query.url);
let neurls=[];
dab.collection('urls').find().forEach(data=>neurls.push(data));
console.log(neurls);
res.render('html',{urls:neurls})


})
app.delete('/:id',(req,res)=>{
    let result='';
    let str = req.params.id;
let fixRegex = /\`\$\{([a-z0-9]+)\}\`/; // Change this line

let resultx = str.replace(fixRegex,'$1');

console.log(ObjectId.isValid(resultx),req.params,req.params.id,result,req.params.id,'here is the req.params._id');
 
    if(ObjectId.isValid(resultx)){
dab.collection('urls').deleteOne({_id:ObjectId(resultx)})
.then(res=>{
    console.log(res,'here is my response');
    result=true;

}).catch(err=>{
    console.log(err);
    result=false;
})
res.json({"redirect":"/"});
    }
    else{
        console.log(req.params.id,'req.params._id');
        result=false;
    }
//     console.log(result,'result');
// if(result===true){
//     console.log('here is the result in if statment',result);
    
// }
// else{
//     console.log(result,'result in the else statment');
// }
})
app.get('/',(req,res)=>{
//  console.log(req.url,urls);
 console.log(req.session,passport.initialize(),req.user,req.session);
let urls=[];
let x=dab.db().collection('urls').find().forEach(url=>{urls.push(url)}).then(response=>{
    
res.render('html',{urls});

}).catch()
console.log(x);

console.log(req.url,urls);
// Url.find().exec((err,data)=>{
//     if(err){
//         console.log(err,'here is a error');
//     }
// if(urls!=''){
// }//     else{
//         console.log(data);
//         urls=data;
//     }
// })

});
app.use(express.static('public'));
app.route('/login').get((req,res)=>{
    // console.log(ObjectId(req.cookies.id).isValid);
    if( ObjectId.isValid((req.cookies.id))){
    dab.db().collection('users').findOne({_id: new ObjectId(req.cookies.id)})
    .then(data=>{
if(data){
    res.redirect('/profile');
}
else{
    res.render('/login');
}
    }).catch(err=>{
        res.send('connecting to database has failed')
    })}
    else{
        res.clearCookie();
        res.render('login');
    }
    
})
let x='';
app.route('/login').post((req,res,next)=>{
dab.db().collection('users').insertOne({
    username:req.body.name,
    password:req.body.password
}).then()
.catch(err=>{res.json(err)});
dab.db().collection('users').findOne({password: req.body.password}).then((data)=>{

    res.cookie('id',data._id,{
    secure:false,
    httpOnly:false,
expires: new Date('01 12 2023'),
sameSite: 'lax'
})
x=req.body.name;
res.redirect('/profile');
})
.catch(err=>{res.json(err)});
console.log(req.cookies,'here is the useres in the post request');

}
); 
app.get('/chat',(req,res)=>{
    
    if(ObjectId.isValid(req.cookies.id)){
        dab.db().collection('users').find({_id: ObjectId(req.cookies.id)})
        .then(data=>{
    if(data){
        res.render('chat');
    }
    else{
        res.redirect('/login');
    }
        }).catch(err=>{
            res.json(err);
        })
    
}}


)
app.get('/profile',
(req,res)=>{
    res.render('profile',{message:x});
}
)
app.get('/get',(req,res)=>{
    console.log(
        req.socket.localAddress,req.ip,req.ips,req.headers['x-forwarded-for']);
// let ipx= req.headers['x-forwarded-for'];    
// let ip=req.header('X-Forworded-For');
// let ip1=req.header('x-forwarded-for');
// let x=req.header('x-forwarded')
// let ip2=req.connection.remoteAddress;
// console.log(req.header(''),ip,'here is the ip',ip1,ipx,ip2);
// res.send(JSON.stringify(req.headers['']));
res.json({
    "ipAdress":req.ip,

    "language":req.headers['accept-language'],

    "software":req.headers['age'],
}
)
console.log(JSON.stringify(req.headers['language']));
// res.render('main',{x:req.ip})
})
app.get('/api/:date',(req,res)=>{

    console.log(req.url);
    let a=req.params.date;
    let regular= /^\d+-\d+-\d+/ig;
    
    res.send(req.params.date);
});
app.post('/postt',(req,res)=>{
console.log(req.files.file);
req.files.file.mv('./uploads/'+req.files.file.name)
res.json({
    "name":req.files.file.name,
    "size":req.files.file.size,
    "type":req.files.file.mimetype,
})
})
app.get('/download',(req,res)=>{
    console.log(__dirname+'/test.js');
    res.download(__dirname+'/test.js',(err,data)=>{
        if(err)console.log(err);
        else console.log(data);
    })
})
app.get('/project/time',(req,res)=>{
    let b="'utc':'sunday',25 Dec 2022 00:00:00 GMT";
res.json(b);});
let a='';
app.post('/x',
(req,res,next)=>{
    
let  regular= /^https:\/\/www.\w+.com$|^www.\w+.com$/;
    if(regular.test(req.body.url)){
       a=true;
   }
    else{
 a=false;
    }
console.log(a,regular.test(req.body.url),typeof req.body.url,req.body.url);
next();
},
(req,res)=>{
if(a==true){
    let x='';
    dab.db().collection('urls')
    .insertOne({"url":req.body.url}).then(res=>{
        if (res){
            x=true;
        }
        console.log(res);
    }).catch(err=>{
        if(err){
            x=false;
        }
        console.log(err);
    });

    res.redirect(req.body.url);
    // let j=new Url({
    //     url:req.body.url})
    //     j.save().then(data=>{res.redirect(req.body.url)})
    // .catch(err=>{res.send(err)})
}
else{
    res.send('unvalid url address');
}})
io.on('connection',(data)=>{
    if(ObjectId.isValid(req.cookies.id)){
    dab.db().collection('users').find({_id: ObjectId(req.cookies.id)})
    .then(data=>{

        io.emit('user',`a user has connected ${req.cookies.id}`);
    })

}
socket.on('disconnect',data=>{
    if(ObjectId.isValid(req.cookies.id)){
    dab.db().collection('users').find({_id: ObjectId(req.cookies.id)})
    .then(data=>{

        io.emit('user',`a user has disconnected ${req.cookies.id}`);
    })

}

})
})