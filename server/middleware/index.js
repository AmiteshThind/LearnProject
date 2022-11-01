import expressJwt from 'express-jwt'

export const requireSignIn = expressJwt({
    getToken: (req,res) => req.cookies.token,
    secret: "update with env key",
    algorithms: ["HS256"] 
})
