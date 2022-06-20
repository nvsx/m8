// import { Sequelize } from "sequelize/types";
import { Sequelize, Model, DataTypes } from 'sequelize';

let db_file = '../db/start.db'

// db_file = req.app.locals.DATABASE
console.log("-------------> db debug", process.env.PORT)

// console.log("\x1b[35mLIB DATABASE: env_database =", process.env["DATABASE"], '\x1b[0m' )
// console.log(global.__basedir)
// console.log("\x1b[35mLIB DATABASE: env_port =", process.env.PORT, '\x1b[0m' )

// if (process.env["DATABASE"]){
//   db_file = process.env["DATABASE"]
// }
// console.log("\x1b[35mLIB DATABASE: db_file =", db_file, '\x1b[0m' )
// let db_file = 'db/start.db'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage:  db_file
});

export default sequelize
