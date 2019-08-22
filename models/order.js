const Sequelize = require('sequelize');

const sequelize = require('../util/database');

<<<<<<< Updated upstream
const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
=======
const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
>>>>>>> Stashed changes
    }
});

module.exports = Order;