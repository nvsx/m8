import fs from 'fs'
import { Sequelize, Model, DataTypes } from 'sequelize'
import sequelize from '../modules/database.js'
import Page from '../models/Page.js'

const public_dir = '../public'

const cePages = {
  // +++++++++++++++++++++++++++++++++
  list: function (req, res) {
    res.sendStatus(200)
  }
  // +++++++++++++++++++++++++++++++++
  edit: function (req, res) {
    res.send("hallo edith").sendStatus(200)
  }
}
