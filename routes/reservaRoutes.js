const express = require("express");
const reserva = require("../models/Reserva"); 
const { Op } = require("sequelize");
const router = express.Router();
const totalMesas = 10;

// Rota para criar uma nova reserva
    router.post("/reserva",  async (req, res) => {
    console.log("Dados recebidos do corpo da requisição:", req.body);
    console.log(req.headers)

   

    const { nome, sobreNome, horaData, quantidadePessoa, email } = req.body;

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


// Rota para deletar uma reserva
router.post("/deletarReserva", async (req, res) => {
    try {
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ mensagem: "Nome e email são obrigatórios!" });
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
});

module.exports = router;
