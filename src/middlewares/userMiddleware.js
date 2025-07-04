const jwt=require('jsonwebtoken');

//Middleware
exports.authUser=(req,res,next)=>{
    console.log('authUser middleware triggered');
    const authHeader=req.headers.authorization;
    const sessionToken=req.session.token;
    console.log('Session token:', sessionToken);
    console.log('Authorization header:', authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    if (!authHeader) {
        console.log("tokenerror")
        return res.status(401).json({message:'Authentication required'})
    }
    
    try{
        if(!sessionToken){
        console.log("tokenerror")
        return res.status(401).json({message:'token is invalid'})
    }
        console.log("success")
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        console.log(verified)
        req.user=verified;
        console.log('User verified:',req.user)
        next()
    }catch(error){
        console.log(error)
        res.status(403).json({message:'invalid token'})
    }
}

// exports.module=authUser;