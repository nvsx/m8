import { Sequelize, Model, DataTypes } from 'sequelize'
import sequelize from '../modules/database.js'

const File = sequelize.define('files', {
	id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
	fullpath: DataTypes.STRING,
	directory: DataTypes.STRING,
	filename: DataTypes.STRING,
	filetype: DataTypes.STRING,
	status: DataTypes.INTEGER,
	title: DataTypes.STRING,
	description: DataTypes.STRING,
	notes: DataTypes.STRING,
	date_start: DataTypes.STRING,
	date_end: DataTypes.STRING,
	tags: DataTypes.STRING,
  content: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

// 1/3 
// This creates the table if it doesn't exist (and does nothing if it already exists)
File.sync()

// 2/3
// This creates the table, dropping it first if it already existed
// Page.sync({ force: true }) 

// 3/3
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model:
// Page.sync({ alter: true }) 

// see also https://sequelize.org/docs/v6/core-concepts/model-basics/

export default File
