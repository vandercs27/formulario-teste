const express = require("express")
const exphbs = require("express-handlebars")
const Sequelize = require("sequelize")
const body_parser = require("body-parser")
const bcrypt = require("bcrypt")
const reserva = require("./models/reserva")
const conn = require("./db/conn")

const app = express()
const port = process.env.PORT || 3000


app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("reserva")
})

app.get("/cardapio", (req, res) => {
    res.render("cardapio")
})

app.get("/sobre", (req, res) => {
    res.render("sobre")
})
app.get("/deletarReserva", (req, res) => {
    res.render("deletarReserva")
})
app.get("/buscarReserva", (req, res) => {
    res.render("buscarReserva")
})

 // criar reserva
app.post("/reserva", async (req, res) => {
    console.log("os dados enviados do body sao: " + req.body)

    const { nome, sobreNome, horaData, quantidadePessoa, email } = req.body
        
    

    try {

        const usuario = await reserva.findOne({where: { nome, sobreNome, email }, raw: true})
       

        if(usuario){
            console.log(usuario.nome)
            console.log("mesa ja esta reservada com esse nome!")
            return res.status(400).json({sucesso: false, mensagem: "ja existe uma reserva cadastrado com esse nome"})
           }

       

        await reserva.create({nome, sobreNome, horaData, quantidadePessoa, email})
        console.log("sua reserva foi feita com sucesso!")

        
        return res.status(201).json({sucesso: true, mensagem: "reserva feita com sucesso!"})
        

        
       }catch(err){
        console.log(err)
      return  res.status(500).json({message: "erro ao fazer reserva", err})
    }


})


// deletar reserva
app.post("/deletarReserva",async (req, res) => {
   

    try {

        const { nome, email} = req.body

        if(!nome || !email){
         return res.status(400).json({mensagem: "nome e emails sao obrigatorios!"})
    
        }

        const deletado = await reserva.destroy({where:{ nome: nome, email: email}})

        if(deletado){
          console.log("reserva deletada com sucesso!")
          return res.status(200).json({mensagem: "reserva deletada com sucesso!"})
        }

      else{
          return res.status(400).json({mensagem: "erro ao deletar reserva!"})
      }

      

      
    }catch(error){
        console.log("erro ao deletar usuario", error)
        return res.status(500).json({mensagem: "erro ao deletar reserva", error})
    }
})

  //buscar reserva
app.get("/buscarReserva", async (req, res) => {
    try {
        const { nome, email } = req.query;

        console.log("parametros recebidos", nome, email)

        if (!nome || !email) {
            console.log("nome e email nao fornecidos")
            return res.status(400).json({ mensagem: "Nome e email são obrigatórios!" });
        }

        const reservaEncontrada = await reserva.findOne({ where: { nome, email }, raw: true });

        if (!reservaEncontrada) {
            console.log("reserva nao encontrada")
            return res.status(404).json({ mensagem: "Reserva não encontrada!" });
        }

        res.json({ reserva: reservaEncontrada });

    } catch (error) {
        console.error("Erro ao buscar a reserva:", error);
        res.status(500).json({ mensagem: "Erro interno do servidor", erro: error.message });
    }
});

   // buscar reserva
app.get("/api/buscarReserva", async (req, res) => {
    try {
        const { nome, email } = req.query;

        console.log("🔍 Buscando reserva para:", nome, email);

        if (!nome || !email) {
            return res.status(400).json({ mensagem: "Nome e email são obrigatórios!" });
        }

        const reservaEncontrada = await reserva.findOne({ where: { nome, email }, raw: true });

        if (!reservaEncontrada) {
            return res.status(404).json({ mensagem: "Reserva não encontrada!" });
        }

        console.log("✅ Reserva encontrada:", reservaEncontrada);
        return res.json({ reserva: reservaEncontrada });

    } catch (error) {
        console.error("❌ Erro ao buscar a reserva:", error);
        return res.status(500).json({ mensagem: "Erro interno do servidor", erro: error.message });
    }
});




  conn.sync().then(() => {
   app.listen(port)
}).catch((err) => {
    console.log(err)
})