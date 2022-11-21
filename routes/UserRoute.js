import express from "express"
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../controllers/Users.js";
import { adminOnly, verifyUser } from "../middleware/AuthUser.js";

const router = express.Router()

router.get('/users', verifyUser, adminOnly, getUsers)
router.get('/users/:id', verifyUser, adminOnly, getUserById)
router.post('/users', verifyUser, adminOnly, createUser)
router.patch('/users/:id', verifyUser, adminOnly, updateUser)
router.delete('/users/:id', verifyUser, adminOnly, deleteUser)

export default router;