const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User",{
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    resetToken:{
        type:DataTypes.STRING
    },
    resetTokenExpiry:{
        type:DataTypes.DATE
    }

});

module.exports = User;
