import Users from "../models/UsersModel.js";
import argon2 from "argon2"

export const Login = async (req, res) => {
    const user = await Users.findOne({
        where: {
            email: req.body.email
        }
    })
    if (!user) return res.status(404).json({ msg: "User not found !" })
    const isMatch = await argon2.verify(user.password, req.body.password)
    if (!isMatch) return res.status(400).json({ msg: "Wrong Password !" })
    req.session.userId = user.uuid
    const uuid = user.uuid
    const name = user.name
    const email = user.email
    const roles = user.roles
    res.status(200).json({ uuid, name, email, roles })
}

export const Me = async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ msg: "Please login in to your account !" })
    const user = await Users.findOne({
        attributes: ['uuid', 'name', 'email', 'roles'],
        where: {
            uuid: req.session.userId
        }
    })
    if (!user) return res.status(404).json({ msg: "User not found !" })
    res.status(200).json(user)
}

export const Logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Sorry you can't logout for now !" })
        res.status(200).json({ msg: "you successfully logout !" })
    })
}