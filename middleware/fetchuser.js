const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sujalsensei';

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    
    if (!token) {
        console.log(error);
        res.status(401).send({ error: "please authenticate yourself" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: "please authenticate yourself" });
    }

}

module.exports=fetchuser;