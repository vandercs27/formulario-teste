const express = require("express");
const exphbs = require("express-handlebars");   
const cors = require("cors")
const conn = require("./db/conn");
const reservaRoutes = require("./routes/reservaRoutes");  // Importando as rotas de reserva

const app = express();
const port = process.env.PORT || 3000;


// Configuração para processar JSON e dados de formulários
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Servir arquivos estáticos
app.use(express.static("public"));

// Usando as rotas separadas
app.use("/", reservaRoutes);

// Rotas principais
app.get("/", (req, res) => res.render("reserva"));
app.get("/cardapio", (req, res) => res.render("cardapio"));
app.get("/sobre", (req, res) => res.render("sobre"));
app.get("/deletarReserva", (req, res) => res.render("deletarReserva"));
app.get("/buscarReserva", (req, res) => res.render("buscarReserva"));
app.get("/deleteAll", (req, res) => res.render("deleteAll"));
app.get("/allReservs", (req, res) => res.render("allReservs"));

// Sincronizar banco de dados e iniciar servidor
conn.sync().then(() => {
    app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
}).catch(err => console.error("Erro ao conectar ao banco:", err));
