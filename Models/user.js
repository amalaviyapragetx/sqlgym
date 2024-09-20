const { DataTypes } = require('sequelize');
const db = require('../Database/connect.js');

const User = db.sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Email is unique
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // Username is unique
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contrycode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isocode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: false,
        validate: {
        async validatePhoneAndCountryCode() {
          const existingUser = await User.findOne({
            where: {
                phone: this.phone,
                contrycode: this.contrycode
            }
        });
        if (existingUser) {
          throw new Error('This phone number and country code combination is already in use.');
      }

        }
    }
});

module.exports = User;
