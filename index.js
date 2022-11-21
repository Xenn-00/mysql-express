import express from "express"
import cors from "cors"
import session from "express-session"
import dotenv from "dotenv"
import SequelizeStore from "connect-session-sequelize"
import userRoutes from "./routes/UserRoute.js"
import productRoutes from './routes/ProductRoute.js'
import authRoutes from './routes/AuthRoutes.js'
import db from "./config/database.js"

dotenv.config()
const app = express()

const sessionStore = SequelizeStore(session.Store)
const store = new sessionStore({
    db: db
})

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

app.use(express.json());
app.use(userRoutes)
app.use(productRoutes)
app.use(authRoutes)
// store.sync()

app.listen(process.env.APP_PORT, () => {
    console.log("Server running...")
})


