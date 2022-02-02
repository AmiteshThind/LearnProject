import expressJwt from 'express-jwt'

export const requireSignIn = expressJwt({
    getToken: (req,res) => req.cookies.token,
    secret: "DYAHUIYFFGJI8934KOPEIRMFNTI6N34NB98RTJIHGT678IKNBY789OLJR34R",
    algorithms: ["HS256"] 
})