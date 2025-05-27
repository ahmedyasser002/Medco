import jwt from 'jsonwebtoken'

// admin authentication middleware
const authAdmin = (req, res, next) => {
    try {
        const {atoken} = req.headers;
        if (!atoken) {
        return res.status(403).json({ success:false , message:"Not Authorized" });
        }
        const tokenDecode = jwt.verify(atoken, process.env.JWT_SECRET);
        if (tokenDecode != process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
        res.status(403).json({ success:false , message:"Not Authorized" });
        }
        next()
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false , message: error.message });

    }
}


export default authAdmin
