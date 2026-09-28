const express = require('express');

const app=express();

const PORT=process.env.PORT || 4800;

app.get("/",(req,res)=>{
    return res.json({message:"Hey, NodeJs Dockerization is happening "})
})

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})