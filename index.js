const express=require('express');
const fs=require('fs');

const app=express();

console.log(__dirname+'/views/html.html')
app.get('/',(req,res)=>{
 console.log(req.url);
 res.sendFile(__dirname+'/views/html.html');
});
app.use(express.static('public'))
app.get('/project/url',(req,res)=>{
    console.log(req.url);
    let a=new Date();
    res.send(a);
});

app.get('/project/time',(req,res)=>{
    let b="'utc':'sunday',25 Dec 2022 00:00:00 GMT";
res.json(b);});

app.listen(5000,'localhost',(err)=>{
    if(err)console.log(err,'here is the err');
    else console.log('we are responding on port 5000');

});
