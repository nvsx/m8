import { Sequelize, Model, DataTypes } from 'sequelize'
import sequelize from '../lib/database.js'
import Node from './Node.js'
import Element from './Element.js'

const Element2Node = sequelize.define('elements2nodes', {
  id: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    primaryKey: true, 
    autoIncrement: true
  },
  elementId: DataTypes.INTEGER,
  nodeId: DataTypes.INTEGER,
  nodeType: DataTypes.STRING,
  posrow: DataTypes.INTEGER,
  posnum: DataTypes.INTEGER,
	title: DataTypes.STRING,
	description: DataTypes.STRING,
	type: DataTypes.STRING,
	status: DataTypes.INTEGER,
	notes: DataTypes.STRING,
	content: DataTypes.STRING,
	date_start: DataTypes.STRING,
	date_end: DataTypes.STRING,
  content: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

// 1/3 
// This creates the table if it doesn't exist (and does nothing if it already exists)
// Element2Node.sync()

// 2/3
// This creates the table, dropping it first if it already existed
// Element2Node.sync({ force: true }) 

// 3/3
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model:
Element2Node.sync({ alter: true }) 

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

export default Element2Node
