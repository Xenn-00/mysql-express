import Users from "../models/UsersModel.js"
import argon2 from "argon2"

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll()
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await Users.findOne({
            where: {
                uuid: req.params.id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, roles } = req.body
    if (password !== confPassword) return res.status(400).json({ msg: "Confirm Password didn't match !" })
    const hashPass = await argon2.hash(password)
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPass,
            roles: roles
        })
        res.status(201).json({ msg: "User successfully created !" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const updateUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if (!user) return res.status(404).json({ msg: "User not found !" })
    const { name, email, password, confPassword, roles } = req.body
    if (password !== confPassword) return res.status(400).json({ msg: "Confirm Password Didn't match !" })
    const hashPass = password === "" || password === null ? user.password : await argon2.hash(password)
    try {
        await Users.update({
            name: name,
            email: email,
            password: hashPass,
            roles: roles
        }, {
            where: {
                id: user.id
            }
        })
        res.status(200).json({ msg: "User successfully updated !" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if (!user) return res.status(404).json({ msg: "User not found !" })
    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        })
        res.status(200).json({ msg: "User successfully deleted" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}