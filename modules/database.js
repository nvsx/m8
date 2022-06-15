// import { Sequelize } from "sequelize/types";
import { Sequelize, Model, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../db/start.db'
});

export default sequelize
