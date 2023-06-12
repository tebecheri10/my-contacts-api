const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
//Public
const registerUser = expressAsyncHandler( async(req, res)=>{
    const { username, email, password } = req.body

    //handle empty fields
    if(!username || !email || !password){
        res.send(400)
        throw new Error("All fields are mandatory")
    }

    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400);
        throw new Error("User already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

    res.json({ message: "Register user", user: user})
})

//Private route
const loginUser = expressAsyncHandler( async(req, res)=>{
    const { email , password } = req.body

    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }

    const user = await User.findOne({ email })
    //compare password with hashed pass
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id
            },
        },
         process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn: "1m"
        })
        
        res.status(200).json({ accessToken })
    }else{
        res.status(401);
        throw new Error("Username or Password incorrect")
    }


    res.json({ message: "Login user"})
})

//Public
const currentUser = expressAsyncHandler( async(req, res)=>{
    res.json({ message: "Current user"})
})

module.exports = {
    registerUser,
    loginUser,
    currentUser
}