import { Sequelize, Model, DataTypes } from 'sequelize'
import sequelize from '../lib/database.js'

const Node = sequelize.define('nodes', {
  id: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    primaryKey: true, 
    autoIncrement: true
  },
	parentid: DataTypes.INTEGER,
	num: DataTypes.INTEGER,
	exists: DataTypes.INTEGER,
	islive: DataTypes.INTEGER,
	ispool: DataTypes.INTEGER,
	layout: DataTypes.STRING,
	topic: DataTypes.STRING,
	title: DataTypes.STRING,
	description: DataTypes.STRING,
	notes: DataTypes.STRING,
	type: DataTypes.STRING,
	slug: DataTypes.STRING, 
	path: DataTypes.STRING,
  link_type: DataTypes.STRING,
  link_value: DataTypes.STRING,
	link_target: DataTypes.STRING,
	caching: DataTypes.STRING,
	image: DataTypes.STRING,
	date_start: DataTypes.STRING,
	date_end: DataTypes.STRING,
	date_recurisve: DataTypes.INTEGER,
	categories: DataTypes.STRING, 
	tags: DataTypes.STRING,
  content: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

// 1/3 
// This creates the table if it doesn't exist (and does nothing if it already exists)
Node.sync()

// 2/3
// This creates the table, dropping it first if it already existed
// Node.sync({ force: true }) 

// 3/3
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model:
// Node.sync({ alter: true }) 

// see also https://sequelize.org/docs/v6/core-concepts/model-basics/

export default Node
