// import { Sequelize, Model, DataTypes } from 'sequelize'
// import sequelize from '../lib/database.js'

// const Article = sequelize.define('articles', {
//   id: {
//     type: DataTypes.INTEGER, 
//     allowNull: false, 
//     primaryKey: true, 
//     autoIncrement: true
//   },
// 	containerid: DataTypes.INTEGER,
// 	status: DataTypes.INTEGER,
// 	channel: DataTypes.INTEGER,
// 	layout: DataTypes.STRING,
// 	type: DataTypes.STRING,
// 	topic: DataTypes.STRING,
// 	title: DataTypes.STRING,
// 	description: DataTypes.STRING,
// 	notes: DataTypes.STRING, 
// 	slug: DataTypes.STRING, 
// 	path: DataTypes.STRING,
// 	robots_index: DataTypes.INTEGER,
// 	robots_follow: DataTypes.INTEGER,
//     in_pool: DataTypes.INTEGER,
// 	in_sitemap: DataTypes.INTEGER,
// 	in_search: DataTypes.INTEGER,
// 	in_menu: DataTypes.INTEGER,
// 	image: DataTypes.STRING,
// 	language: DataTypes.STRING,
// 	date_start: DataTypes.STRING,
// 	date_end: DataTypes.STRING,
// 	categories: DataTypes.STRING, 
// 	tags: DataTypes.STRING,
// 	content: {
// 		type: Sequelize.STRING,
// 		allowNull: true,
//   	}
// });

// // 1-3: also see https://sequelize.org/docs/v6/core-concepts/model-basics/

// // 1/3 
// // This creates the table if it doesn't exist (and does nothing if it already exists)
// Article.sync()

// // 2/3
// // This creates the table, dropping it first if it already existed
// // Article.sync({ force: true }) 

// // 3/3
// // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model:
// // Article.sync({ alter: true }) 

// export default Article
