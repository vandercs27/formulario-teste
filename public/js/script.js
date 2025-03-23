document.addEventListener("DOMContentLoaded", function () {
    // Pegando os formulários individuais
    const formBuscar = document.querySelector("#formBuscar");
    const formCancelar = document.querySelector(".delete form");
    const formReservar = document.querySelector(".body .form form");

        // Função para buscar reserva
        if (formBuscar) {
            formBuscar.addEventListener("submit", async function (event) {
                event.preventDefault();

                const nomeBusca = document.querySelector("#nome_busca").value;
                const emailBusca = document.querySelector("#email_busca").value;
                const listaReservas = document.querySelector(".lista_reservas");

                if (!nomeBusca || !emailBusca) {
                    listaReservas.innerHTML = `<p style="color: red;">Por favor, preencha todos os campos.</p>`;
                    return;
                }

                try {

                    
                    listaReservas.innerHTML = "<p>Buscando reserva...</p>";
                    
                    const response = await fetch(`http://localhost:3000/buscarReserva`,{
                        method: "post",
                        headers: {"content-type": "application/json"},
                        body: JSON.stringify({nome: nomeBusca, email: emailBusca})
                    });

                   

                    if (!response.ok) {
                        const erroData = await  response.json()
                        listaReservas.innerHTML = `<p style="color: red;">Erro: ${erroData.message}</p>`;
                        return;
                    }

                    const data = await response.json();
                    console.log("Resposta do backend:", data);

                    

                    if (!data) {
                        listaReservas.innerHTML = `<p style="color: red;">Nenhuma reserva encontrada.</p>`;
                        return;
                    }

                    listaReservas.innerHTML = `
                        <p><strong>Nome:</strong> ${data.nome}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Data e Hora:</strong> ${data.horaData || "Não informado"}</p>
                        <p><strong>Quantidade de Pessoas:</strong> ${data.quantidadePessoa || "Não informado"}</p>
                    `;
                } catch (error) {
                    console.error("Erro ao buscar reserva:", error);
                    listaReservas.innerHTML = `<p style="color: red;">Erro ao buscar a reserva! Detalhe: ${error.message}</p>`;
                }
            });
    }

    // Função para deletar reserva
    if (formCancelar) {
        formCancelar.addEventListener("submit", async function (event) {
            event.preventDefault();

            const nomeCancelar = document.querySelector("#nome_cancelar").value;
            const emailCancelar = document.querySelector("#email_cancelar").value;
            const feedback = document.querySelector(".delete .feedback p");

            if (!nomeCancelar || !emailCancelar) {
                feedback.innerHTML = "Por favor, preencha todos os campos.";
                feedback.style.color = "red";
                return;
            }

            try {
                const response = await fetch(`/deletarReserva`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nome: nomeCancelar, email: emailCancelar })
                });

                if (response.ok) {
                    feedback.innerHTML = "Reserva cancelada com sucesso!";
                    feedback.style.color = "green";
                } else {
                    const data = await response.json();
                    feedback.innerHTML = `Erro ao cancelar: ${data.mensagem}`;
                    feedback.style.color = "red";
                }
            } catch (error) {
                console.error("Erro ao cancelar reserva:", error);
                feedback.innerHTML = `Erro ao cancelar reserva! Detalhe: ${error.message}`;
                feedback.style.color = "red";
            }
        });
    }

    // Função para fazer reserva
    if (formReservar) {
        formReservar.addEventListener("submit", async function (event) {
            event.preventDefault();

            const nomeReserva = document.querySelector("#nome_reserva").value;
            const sobreNome = document.querySelector("#sobrenome").value;
            const horaData = document.querySelector("#horario_data").value;
            const quantidadePessoa = document.querySelector("#qtd_pessoas").value;
            const emailReserva = document.querySelector("#email_reserva").value;
            const feedback = document.querySelector(".body .feedback p");

            if (!nomeReserva || !sobreNome || !horaData || !quantidadePessoa || !emailReserva) {
                feedback.innerHTML = "Por favor, preencha todos os campos.";
                feedback.style.color = "red";
                return;
            }

            try {
                const response = await fetch(`/reserva`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nome: nomeReserva,
                        sobreNome: sobreNome,
                        horaData: horaData,
                        quantidadePessoa: quantidadePessoa,
                        email: emailReserva
                    })
                });

                if (response.ok) {
                    feedback.innerHTML = "Reserva realizada com sucesso!";
                    feedback.style.color = "green";
                } else {
                    const data = await response.json();
                    feedback.innerHTML = `Erro ao reservar: ${data.mensagem}`;
                    feedback.style.color = "red";
                }
            } catch (error) {
              
                feedback.innerHTML = `Erro ao fazer reserva! Detalhe: ${error.message}`;
                feedback.style.color = "red";
            }
        });
    }
});
