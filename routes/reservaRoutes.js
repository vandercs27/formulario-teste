const express = require("express");
const reserva = require("../models/Reserva"); 
const { Op } = require("sequelize");
const router = express.Router();
const totalMesas = 10;
const nodemailer = require("nodemailer");
const Reserva = require("../models/Reserva");
const { raw } = require("body-parser");
require('dotenv').config();
const dayjs = require("dayjs")



// Rota para criar uma nova reserva
    router.post("/reserva",  async (req, res) => {
    console.log("Dados recebidos do corpo da requisição:", req.body);
    console.log(req.headers)
    
    const { nome, sobreNome, horaData, quantidadePessoa, email } = req.body;

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!regexEmail.test(email)){
        // voce pode renderizar a mesma pagina com uma mensagem de erro.
        return res.render("reserva", { erro: "email inválido!"})
    }

    if (!horaData) {
        return res.status(400).json({ message: "Data e hora da reserva são obrigatórias!" });
    }

    try {
        const dataReserva = horaData.split("T")[0];

        const dataInicio = new Date(`${dataReserva}T00:00:00`);
        const dataFim = new Date(`${dataReserva}T23:59:59`);

        const reservasAtivas = await reserva.count({
            where: {
                horaData: { [Op.gte]: dataInicio, [Op.lte]: dataFim },
                status: "ocupada"
            }
        });

        if (reservasAtivas >= totalMesas) {
            return res.status(400).json({ message: "Todas as mesas estão ocupadas no momento." });
        }

        const usuario = await reserva.findOne({
            where: { nome, email, horaData: { [Op.gte]: dataInicio, [Op.lte]: dataFim } },
            raw: true
        });

        if (usuario) {
            return res.status(400).json({ message: "Já existe uma reserva cadastrada com esse nome e e-mail." });
        }

        if (reservasAtivas + parseInt(quantidadePessoa) > totalMesas) {
            return res.status(400).json({ message: "Não há mesas suficientes para essa quantidade de pessoas!" });
        }

        await reserva.create({ nome, sobreNome, horaData, quantidadePessoa, email, status: "reservada" });
        console.log("Reserva feita com sucesso!");

         // ✅ Configurar envio de e-mail
         const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "vandercs80@gmail.com",
                pass: "gmlrdjhomjwxwfoh"
            }
        });

        const mailOptions = {
            from: "vandercs80@gmail.com", // corrigido
            to: email,
            subject: "Confirmação de Reserva",
            text: `Olá ${nome}, sua reserva para ${quantidadePessoa} pessoa(s) foi confirmada para o dia ${horaData}. Obrigado!`
        };

        await transporter.sendMail(mailOptions);
        console.log("E-mail de confirmação enviado!");
        return res.status(201).json({ sucesso: true, mensagem: "Reserva feita com sucesso!" }); 
          
    } catch (error) {
        console.error("Erro ao processar a reserva:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }


});

  // rota para buscar reservas
    router.post("/buscarReserva", async (req, res) => {
    console.log("Query recebida:", req.body); // 👀 Log para depuração

        const { nome, email } = req.body
    try {
       
      
      if(!nome || !email){
        console.log("nome e email são obrigatorios!")
        return res.status(400).json({message: "nome e email são obrigatorios!"})
      }
      
      const buscaReserva = await reserva.findOne({where: {nome, email}})
      

      if(!buscaReserva){
        console.log("reserva nao encontrada!")
        return res.status(404).json({message: "dados da reserva nao encontrado!"})

      }

    

      console.log("reserva encontrada com sucesso!", buscaReserva)
      return res.status(200).json(buscaReserva)


    }catch(error){
        console.log("erro ao buscar reserva!", error)
        return res.status(400).json({message: "erro ao buscar reserva"})
    }

})

// listar todas as reservas


router.get("/allReservs", async (req, res) => {
    const {nome} = req.query
 
   try{

    let todasReservas
    
    if(nome){
        todasReservas = await Reserva.findAll({where: {nome}, raw: true})
    }else{
        todasReservas = await Reserva.findAll({ raw: true})
    }
     
    // formatar data
    todasReservas.forEach(reserva => {
        reserva.horaData = dayjs(reserva.horaData).format("DD/MM/YYYY HH:mm")
    })

    return res.render("allReservs", {todasReservas})

   }catch(error){
    console.log("erro ao buscar reserva!", error)
    res.status(500).json({message: "erro ao buscar reserva!"})
   }


})


// Rota para deletar uma reserva
router.post("/deletarReserva", async (req, res) => {
    const { nome, email } = req.body;
    console.log(nome,email)
    try {
         const buscando = await reserva.findOne({where: {nome, email}})

        if (!buscando) {
            console.log("nome e emails sao obrigatorios!")
             res.status(400).json({ mensagem: "Nome e email são obrigatórios!" });
        }

        const deletado = await reserva.destroy({ where: { nome, email } });

        if (deletado) {
            console.log("Reserva deletada com sucesso!");
            return res.status(200).json({ mensagem: "Reserva deletada com sucesso!" });
        } else {
            return res.status(400).json({ mensagem: "Erro ao deletar reserva!" });
        }
    } catch (error) {
        console.error("Erro ao deletar reserva:", error);
        return res.status(500).json({ mensagem: "Erro ao deletar reserva", error });
    }
})

// rota para deletar tudo
router.post("/deleteAll", async (req, res) => {
   
    try {
      
       const eraseDb = await reserva.destroy( { where:{} } );

        if (eraseDb) {
            console.log("banco de dados deletado com sucesso!");
            return res.status(200).json({ mensagem: "banco de dados deletado com sucesso!" });
        } else {
            return res.status(400).json({ mensagem: "Erro ao deletar o banco de dados!" });
        }
    } catch (error) {
        console.error("Erro ao deletar o banco de dados:", error);
        return res.status(500).json({ mensagem: "Erro ao deletar o banco de dados", error });
    }

})

module.exports = router