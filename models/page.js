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

export default Page
