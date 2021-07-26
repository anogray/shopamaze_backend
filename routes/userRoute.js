import express from 'express';
import { getToken } from '../util.js';
import User from '../model/userModel.js';

const router = express.Router();

router.post('/register', async (req, res) => {

  try{
    const {name,email,password,isAdmin} = req.body;

    const user = new User({
      name: name,
      email: email,
      password: password,
      // isAdmin:isAdmin ? isAdmin:false
    });
    const newUser = await user.save();
      res.send({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
         token: getToken(newUser),
      });
}catch(err){
      res.status(409).json({ message: `${err.message} Invalid User Data.` });
    }
  })
  
router.post("/signin", async(req, res)=>{
  
  try{
    const {email , password} = req.body;
    const signinUser = await User.findOne({email:req.body.email, password : req.body.password});
    console.log({signinUser});
    if(signinUser){
      res.status(200).send({
        _id: signinUser.id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: signinUser.isAdmin,
        token: getToken(signinUser),
      });
    }
  }catch(err){
    console.log(err.message);
    res.status(401).send({ message: 'Invalid Email or Password.' });
  }
})

router.post('/createadmin', async (req, res) => {
  try {
    const user = new User({
      name: 'Apple',
      email: 'admin@example.com',
      password: '123456789',
      isAdmin: true,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ message: error.message });
  }
});


export default router ;  