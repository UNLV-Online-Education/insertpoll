var dbConfig = require('config').get('db')
var Sequelize = require('sequelize')
var DataTypes = require('sequelize/lib/data-types')

var sequelize = new Sequelize(
  dbConfig.schema,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    define: {
      timestamps: false
    }
  }
)

var polls = sequelize.define(
  'insertpoll_polls',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: true,
      primaryKey: false,
      autoIncrement: false
    },
    answer_choices: {
      type: DataTypes.TEXT,
      allowNull: true,
      primaryKey: false,
      autoIncrement: false
    }
  },
  {
    tableName: 'insertpoll_polls'
  }
)

var responses = sequelize.define(
  'insertpoll_responses',
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    poll_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false
    },
    course_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: false,
      autoIncrement: false
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: false,
      autoIncrement: false
    }
  },
  {
    tableName: 'insertpoll_responses'
  }
)

responses.belongsTo(polls, {
  foreignKey: 'poll_id',
  as: 'poll'
})
module.exports = {
  polls: polls,
  responses: responses,
  sequelize: sequelize
}
