import { Sequelize } from "sequelize";

const db = new Sequelize('login_auth_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})


export default db;