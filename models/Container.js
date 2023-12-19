import { Sequelize, Model, DataTypes, UniqueConstraintError } from 'sequelize'
import sequelize from '../lib/database.js'

const Container = sequelize.define('containers', {
  id: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    primaryKey: true, 
    autoIncrement: true
  },
  parentid: DataTypes.INTEGER,
  num: DataTypes.INTEGER,
  islive: DataTypes.INTEGER,
  hidden: DataTypes.INTEGER,
  deleted: DataTypes.INTEGER,
  has_articles: DataTypes.INTEGER,
  has_archive: DataTypes.INTEGER,
  layout: DataTypes.STRING,
  topic: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  notes: DataTypes.STRING,
  type: DataTypes.STRING,
  path: {
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: false
  },
  articleid: DataTypes.INTEGER,
  image1: DataTypes.STRING,
  image2: DataTypes.STRING,
  date_start: DataTypes.STRING,
  date_end: DataTypes.STRING,
  date_recurisve: DataTypes.INTEGER,
  creation_user: DataTypes.INTEGER,
  creation_date: DataTypes.DATE,
  modification_user: DataTypes.STRING,
  modification_date: DataTypes.DATE,
  content: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

// 1/3 
// This creates the table if it doesn't exist (and does nothing if it already exists)
Container.sync()

// 2/3
// This creates the table, dropping it first if it already existed
// Container.sync({ force: true }) 

// 3/3
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model:
// Container.sync({ alter: true }) 

// see also https://sequelize.org/docs/v6/core-concepts/model-basics/

export default Container
