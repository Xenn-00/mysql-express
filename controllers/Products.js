import Products from "../models/ProductsModel.js";
import Users from "../models/UsersModel.js";
import { Op } from "sequelize";

export const getProducts = async (req, res) => {
    try {
        // req.roles is come from middleware verifyUser
        const response = req.roles === "admin" ? await Products.findAll({
            attributes: ['uuid', 'name', 'price'],
            include: [{
                attributes: ['name', 'email'],
                model: Users
            }]
        }) : await Products.findAll({
            attributes: ['uuid', 'name', 'price'],
            where: {
                userId: req.userId
            },
            include: [{
                attributes: ['name', 'email'],
                model: Users
            }]
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!product) return res.status(404).json({ msg: "Product not found !" })
        const response = req.roles === "admin" ? await Products.findOne({
            attributes: ['uuid', 'name', 'price'],
            where: {
                id: product.id
            },
            include: [{
                attributes: ['name', 'email'],
                model: Users
            }]
        }) : await Products.findOne({
            attributes: ['uuid', 'name', 'price'],
            where: {
                [Op.and]: [{ id: product.id }, { userId: req.userId }]
            },
            include: [{
                attributes: ['name', 'email'],
                model: Users
            }]
        })
        res.status(200).json(response)
    } catch (error) {

    }
}

export const createProduct = async (req, res) => {
    const { name, price } = req.body

    try {
        await Products.create({
            name: name,
            price: price,
            userId: req.userId
        })
        res.status(201).json({ msg: "Product successfully added !" })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!product) return res.status(404).json({ msg: "Product not found !" })
        const { name, price } = req.body
        if (req.roles === 'admin') {
            await Products.update({
                name: name,
                price: price
            }, {
                where: {
                    id: product.id
                }
            })
        } else {
            if (req.userId !== product.userId) return res.status(403).json({ msg: "Forbidden access !" })
            await Products.update({
                name: name,
                price: price
            }, {
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                }
            })
        }
        res.status(201).json({ msg: "Product updated successfully !" })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        })
        if (!product) return res.status(404).json({ msg: "Product not found !" })
        if (req.roles === 'admin') {
            await Products.destroy({
                where: {
                    id: product.id
                }
            })
        } else {
            if (req.userId !== product.userId) return res.status(403).json({ msg: "Forbidden access !" })
            await Products.destroy({
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                }
            })
        }
        res.status(200).json({ msg: "Product deleted successfully !" })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}