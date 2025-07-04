const express =require('express')
const userController=require('../controller/userController')
const {authUser}=require('../middlewares/userMiddleware')
const router=express.Router()

router.post('/create',userController.createUser)
router.post('/login',userController.loginUser)
router.get('/getuser',authUser,userController.getUser)
router.get('/logout',authUser,userController.logout)
module.exports=router
