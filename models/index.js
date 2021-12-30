const Sequelize = require("sequelize");
const User = require("./user");
const Comment = require("./comment");

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

/* MySQL 연결 객체 */
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.Comment = Comment;

/* 정적 함수들 실행 */
User.init(sequelize);
Comment.init(sequelize);

/* 다른 테이블 과의 관계를 나타내는 associate 메서드도 일단 실행한다. */
User.associate(db);
Comment.associate(db);

module.exports = db;
