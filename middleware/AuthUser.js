import Users from "../models/UsersModel.js";

export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ msg: "Please login into your account !" })
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId
        }
    })
    if (!user) return res.status(404).json({ msg: "User not found !" })
    req.userId = user.id
    req.roles = user.roles
    next()
}
export const adminOnly = async (req, res, next) => {
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId
        }
    })
    if (!user) return res.status(404).json({ msg: "User not found !" })
    if (user.roles !== 'admin') return res.status(403).json({ msg: "Access Forbidden !" })
    next()
}



