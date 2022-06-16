import { Sequelize, Model, DataTypes } from 'sequelize'
import sequelize from '../modules/database.js'

const Page = sequelize.define('pages', {
	id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
	parentid: DataTypes.INTEGER,
	status: DataTypes.INTEGER,
	layout: DataTypes.STRING,
	layout_current: DataTypes.STRING,
	title: DataTypes.STRING,
	description: DataTypes.STRING,
	notes: DataTypes.STRING,
	type: DataTypes.STRING,
	slug: DataTypes.STRING, 
	path: DataTypes.STRING,
	robots_index: DataTypes.INTEGER,
	robots_follow: DataTypes.INTEGER,
	in_sitemap: DataTypes.INTEGER,
	in_search: DataTypes.INTEGER,
	in_menu: DataTypes.INTEGER,
	link_target: DataTypes.STRING,
	caching: DataTypes.STRING,
	image: DataTypes.STRING,
	language: DataTypes.STRING,
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
Page.sync()

// 2/3
// This creates the table, dropping it first if it already existed
// Page.sync({ force: true }) 

// 3/3
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model:
// Page.sync({ alter: true }) 

// see also https://sequelize.org/docs/v6/core-concepts/model-basics/

export default Page
