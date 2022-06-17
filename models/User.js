import { Sequelize, Model, DataTypes } from 'sequelize'
import sequelize from '../modules/database.js'

const User = sequelize.define('users', {
	id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
	loginname: DataTypes.STRING,
	password: DataTypes.STRING,
	email: DataTypes.STRING,
	status: DataTypes.INTEGER,
	admin: DataTypes.INTEGER,
	primarygroup: DataTypes.STRING,
	notes: DataTypes.STRING,
	date_start: DataTypes.STRING,
	date_end: DataTypes.STRING,
  content: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

// 1/3 
// This creates the table if it doesn't exist (and does nothing if it already exists)
User.sync()

// 2/3
// This creates the table, dropping it first if it already existed
// Page.sync({ force: true }) 

// 3/3
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model:
// Page.sync({ alter: true }) 

// see also https://sequelize.org/docs/v6/core-concepts/model-basics/

export default User
