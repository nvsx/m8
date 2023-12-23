import { Sequelize, Model, DataTypes } from 'sequelize'
import sequelize from '../lib/database.js'

const Xlink = sequelize.define('xlinks', {
  id: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    primaryKey: true, 
    autoIncrement: true
  },
	title: DataTypes.STRING,
	description: DataTypes.STRING,
	internal_notes: DataTypes.STRING,
	url: DataTypes.STRING,
	createdAt: DataTypes.STRING,
	updatedAt: DataTypes.STRING
});

// 1/3 
// This creates the table if it doesn't exist (and does nothing if it already exists)
// Element.sync()

// 2/3
// This creates the table, dropping it first if it already existed
// Element.sync({ force: true }) 

// 3/3
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model:
Xlink.sync({ alter: true }) 

// see also https://sequelize.org/docs/v6/core-concepts/model-basics/

// Element.belongsToMany(Node, {
//   through: "node_element",
//   as: "elements",
//   foreignKey: "element_id",
// });
// Node.belongsToMany(Element, {
//   through: "node_element",
//   as: "nodes",
//   foreignKey: "node_id",
// });

export default Xlink
