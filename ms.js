let estado = { quadro: [], jogoAtual: [], jogoSalvo: [] };

function inicio() {
    lerLocalStorage();
    criarCampo();
    iniciarJogo();
    apagarMemoria();
}

function lerLocalStorage() {
    if (!window.localStorage) {
        return;
    }

    let salvamentoJogoPorLocalStorage = window.localStorage.getItem('jogos-salvos');

    if (salvamentoJogoPorLocalStorage) {
        estado.jogoSalvo = JSON.parse(salvamentoJogoPorLocalStorage);
    }
}

function escreverNoLocalStorage() {
    window.localStorage.setItem('jogos-salvos', JSON.stringify(estado.jogoSalvo));
}

function criarCampo() {
    estado.campo = [];

    for (let i = 1; i <= 60; i++) {
        estado.campo.push(i);
    }

}

function iniciarJogo() {
    resetarJogo();
    renderizar();
}

function renderizar() {
    renderizarCampo();
    renderizarBotoes();
    renderizarSalvarJogo();
}

function renderizarCampo() {
    let divJogo = document.querySelector('#numeros-megasena');
    divJogo.innerHTML = '';

    let ulNumeros = document.createElement('ul');
    ulNumeros.classList.add('numeros');

    for (let i = 0; i < estado.campo.length; i++) {
        let numeroAtual = estado.campo[i];
        let liNumero = document.createElement('li');
        liNumero.textContent = numeroAtual;
        liNumero.classList.add('numero');

        liNumero.addEventListener('click', numeroClick);

        if ((numeroUsado)(numeroAtual)) {
            liNumero.classList.add('selecionar-numero')
        }

        ulNumeros.appendChild(liNumero);
    }

    divJogo.appendChild(ulNumeros);
}

function numeroClick(evento) {
    let value = Number((evento.currentTarget.textContent));

    if (numeroUsado(value)) {
        removerNumero(value)
    }
    else {
        addNumeroJogo(value);
    }

    renderizar();
}

function renderizarBotoes() {
    let divBotoes = document.querySelector('#botao-megasena');
    divBotoes.innerHTML = '';

    let botaoNovoJogo = createNewGameButton();

    let botaoJogoAleatorio = botaoCriarJogoAleatorio();

    let botaoSalvarJogo = botaoSalvar();


    divBotoes.appendChild(botaoNovoJogo);

    divBotoes.appendChild(botaoJogoAleatorio);

    divBotoes.appendChild(botaoSalvarJogo);

}

function createNewGameButton() {
    let button = document.createElement('button');
    button.textContent = 'Novo jogo';

    button.addEventListener('click', iniciarJogo);

    return button;
}

function botaoCriarJogoAleatorio() {
    let button = document.createElement('button');
    button.textContent = 'Jogo aleatório';

    button.addEventListener('click', jogoAleatorio);

    return button;
}

function botaoSalvar() {
    let button = document.createElement('button');
    button.textContent = 'Salvar jogo';
    button.disabled = !jogoCompleto();

    button.addEventListener('click', salvarJogo);

    return button;
}

function renderizarSalvarJogo() {
    let divSalvarJogo = document.querySelector('#jogo-megasena');
    divSalvarJogo.innerHTML = '';

    if (estado.jogoSalvo.length === 0) {
    } else {
        let ulJogoSalvo = document.createElement('ul');

        for (var i = 0; i < estado.jogoSalvo.length; i++) {
            let jogoAtual = estado.jogoSalvo[i];

            let liJogo = document.createElement('li');
            liJogo.textContent = jogoAtual.join(', ');

            ulJogoSalvo.appendChild(liJogo);
        }

        divSalvarJogo.appendChild(ulJogoSalvo);
    }
}

function addNumeroJogo(numeroAdd) {
    if (numeroAdd < 1 || numeroAdd > 60) {
        console.error('Número inválido', numeroAdd);
        return;
    }

    if (estado.jogoAtual.length >= 15) {
        // console.error('Quantidade inválida, máximo 15 números.');
        return;
    }

    if (numeroUsado(numeroAdd)) {
        // console.error('Este número já foi selecionado, escolha outro.', numeroAdd);
        return;
    }

    estado.jogoAtual.push(numeroAdd);
}

function removerNumero(numeroRemove) {
    if (numeroRemove < 1 || numeroRemove > 60) {
        console.error('Número inválido', numeroRemove);
        return;
    }

    let novoJogo = []

    for (let i = 0; i < estado.jogoAtual.length; i++) {
        let numeroAtual = estado.jogoAtual[i]

        if (numeroAtual === numeroRemove) {
            continue;
        }

        novoJogo.push(numeroAtual);
    }

    estado.jogoAtual = novoJogo;
}

function numeroUsado(numeroVerifica) {
    return estado.jogoAtual.includes(numeroVerifica);
}

function salvarJogo() {
    if (!jogoCompleto()) {
        console.error('O jogo não está completo!');
        return;
    }

    estado.jogoSalvo.push(estado.jogoAtual);
    escreverNoLocalStorage();
    iniciarJogo();
}

function jogoCompleto() {
    return estado.jogoAtual.length >= 6;
}

function resetarJogo() {
    estado.jogoAtual = [];
}

function jogoAleatorio() {
    resetarJogo();

    while (!jogoCompleto()) {
        let numeroAleatorio = Math.ceil(Math.random() * 60);
        addNumeroJogo(numeroAleatorio);
    }

    renderizar();
}



inicio();