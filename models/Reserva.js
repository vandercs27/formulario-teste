const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Reserva = db.define("Reserva", {
    id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         allowNull: false,
         primaryKey: true
    },
    nome: {
       
        type: DataTypes.STRING,
        allowNull: false,
       
    },

   sobreNome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    horaData: {
        type: DataTypes.STRING,
        allowNull: false
    },

    quantidadePessoa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Reserva