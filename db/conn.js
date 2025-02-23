    const { Sequelize } = require("sequelize")

    const sequelize = new Sequelize("sistemburger", "root", "", {
        host: "localhost",
        dialect: "mysql"
    })

    //try {
      //  sequelize.authenticate()
        //console.log("conectado com sucesso ao mysql!")
    //}catch(err){
      //  console.log("erro ao se conectar!")
    //}


    module.exports = sequelize