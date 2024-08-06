const { User } = require('../model/User');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/signup', async (req, res) => {
    const { name, phone, email, password, isAdmin } = req.body
    try{
      const existingUser = await User.findOne({ email: email });
      if(existingUser){
         res.status(400).json({ error:true, msg: "user already exist"})
      }
 
      const hashPassword = await bcrypt.hash(password,10)

      const result = await User.create({
         name:name,
         phone:phone,
         email:email,
         password:hashPassword,
         isAdmin:isAdmin
      });

      const token = jwt.sign({email:result.email, id:result._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY)
       
      res.status(200).json({
         user:result,
         token:token
      })
    } catch(error){
      //   console.log(error)
        res.status(500).json({error:true, msg:"something went wrong"})     
    }
  
});

router.post('/signin', async (req, res) => {
   const { email, password } = req.body
   try{
     const existingUser = await User.findOne({ email: email });
     if(!existingUser){
        res.status(404).json({error:true, msg: "user not found"})
     }

     const matchPassword = await bcrypt.compare(password, existingUser.password)
      
     if(!matchPassword){
        return res.status(400).json({error:true, msg:"invalid email or Password"})
     }

     const token = jwt.sign({email:existingUser.email, id:existingUser._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY, {expiresIn:'3h'});
     
     res.status(200).json({
        user:existingUser,
        token,
        msg:"User Authenticated"
     })
   } catch(error){
      //  console.log(error)
       res.status(500).json({error:true, msg:"something went wrong"})
   }

});

router.get('/', async(req,res)=>{
   const userList = await User.find();
    if(!userList){
      res.status(500).json({success: false})
    }
    res.send(userList);
});

router.get('/:id', async(req,res)=>{
   const user = await User.findById(req.params.id);
    if(!user){
      res.status(500).json({message:"The user with the given ID was not found"})
    }
    res.send(200).send(user)
});

router.delete('/:id', async(req,res)=>{
   User.findByIdAndDelete(req.params.id).then(user =>{
       if(user){
         return res.status(200).json({ success: true, message:"The user is delete"})
       }else{
         return res.status(404).json({success:false, message:"User not found"})
       }
   }).catch( error =>{
      return res.status(500).json({success: false, error: error})
   })
});

router.get('/get/count', async(req,res)=>{
   const userCount = await User.countDocuments((count)=> count);
    if(!userCount){
      res.status(500).json({success:false})
    }
    res.send({
      userCount: userCount
    })
});

router.put('/:id', async(req,res)=>{
   const {name, phone, email, password} = req.body

   const userExist = await User.findById(req.params.id)
   let newPassword
    if(req.body.password){
      newPassword = bcrypt.hashSync(req.body.password, 10)
    }else{
      newPassword = userExist.passwordHash
    }

    const user = await User.findByIdAndDelete(
        req.params.id,{
          name:name,
          phone:phone,
          email:email,
          password:newPassword
        },
        {new: true}
    )

    if(!user){
       return res.status(400).send("The user cannot be Updated")
    }
    res.send(user)

});

module.exports = router;
