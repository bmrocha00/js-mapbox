const URL = 'https://b5a447f9-cabb-45b8-805f-f98beefa428e-00-2xhlexjgiir5f.janeway.replit.dev/locais';

const centralLatLong = [-43.9397233, -19.9332786];
let map;

function criarMarcador(local) {
    let popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
            <h3><a href="${local.url}" target="_blank">${local.descricao}</a></h3>
            <br>${local.endereco}<br>${local.cidade}
        `);

    const longitude = Number(local.latlong[0]);
    const latitude = Number(local.latlong[1]);

    if (!isNaN(latitude) && !isNaN(longitude)) {
        new mapboxgl.Marker({ color: local.cor })
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(map);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchComRetry(url, options = {}, tentativas = 3) {
    for (let i = 0; i < tentativas; i++) {
        try {
            const resposta = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                }
            });
            
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status} - ${resposta.statusText}`);
            }
            
            return resposta;
        } catch (erro) {
            if (i === tentativas - 1) throw erro;
            await delay(1000 * (i + 1));
        }
    }
}

window.onload = async () => {
    try {
        const resposta = await fetchComRetry(URL);
        const dados = await resposta.json();
        montarMapa(dados);
        
    } catch (erro) {
        alert(`Erro ao conectar com o servidor: ${erro.message}`);
        montarMapa([]);
    }
};

function montarMapa(dadosLocais) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9tbWVsY2FybmVpcm8tcHVjIiwiYSI6ImNsb3ZuMTBoejBsd2gyamwzeDZzcWl5b3oifQ.VPWc3qoyon8Z_-URfKpvKg';

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: centralLatLong,
        zoom: 9
    });

    map.on('load', () => {
        dadosLocais.forEach(local => criarMarcador(local));

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(processarGetCurrentPosition);
        }
    });
}

function processarGetCurrentPosition(posicao) {
    let popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>Estou aqui!</h3>`);

    new mapboxgl.Marker({ color: 'yellow' })
        .setLngLat([posicao.coords.longitude, posicao.coords.latitude])
        .setPopup(popup)
        .addTo(map);
}

async function processar() {
    const nome = document.getElementById("nome").value.trim();
    const latitude = document.getElementById("latitude").value.trim();
    const longitude = document.getElementById("longitude").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const url = document.getElementById("url").value.trim();
    const cor = document.getElementById("cor").value;

    if (!nome || !latitude || !longitude || !endereco || !descricao) {
        alert("Preencha todos os campos obrigatórios");
        return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
        alert("Latitude e longitude devem ser números válidos");
        return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        alert("Coordenadas inválidas. Latitude: -90 a 90, Longitude: -180 a 180");
        return;
    }

    const novoLocal = {
        descricao: descricao,
        endereco,
        favorito: true,
        cidade: nome,
        latlong: [lng, lat],
        url: url || '',
        cor: cor || '#ff0000'
    };

    try {
        const resposta = await fetchComRetry(URL, {
            method: 'POST',
            body: JSON.stringify(novoLocal)
        });

        const localCriado = await resposta.json();
        
        criarMarcador(localCriado);
        
        document.getElementById("nome").value = '';
        document.getElementById("latitude").value = '';
        document.getElementById("longitude").value = '';
        document.getElementById("endereco").value = '';
        document.getElementById("descricao").value = '';
        document.getElementById("url").value = '';
        document.getElementById("cor").value = '#ff0000';
        
        alert("Local adicionado com sucesso!");
        
    } catch (erro) {
        alert(`Erro ao adicionar local: ${erro.message}`);
    }
}

async function editarLocal() {
    const idEdicao = document.getElementById("idEdicao").value.trim();
    if (!idEdicao) {
        alert("Informe um ID válido para editar");
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const latitude = document.getElementById("latitude").value.trim();
    const longitude = document.getElementById("longitude").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const url = document.getElementById("url").value.trim();
    const cor = document.getElementById("cor").value;

    if (!nome || !latitude || !longitude || !endereco || !descricao) {
        alert("Preencha todos os campos obrigatórios");
        return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
        alert("Latitude e longitude devem ser números válidos");
        return;
    }

    const localAtualizado = {
        descricao,
        endereco,
        favorito: true,
        cidade: nome,
        latlong: [lng, lat],
        url: url || '',
        cor: cor || '#ff0000'
    };

    try {
        const resposta = await fetchComRetry(`${URL}/${idEdicao}`, {
            method: 'PUT',
            body: JSON.stringify(localAtualizado)
        });

        const resultado = await resposta.json();

        alert("Local atualizado com sucesso!");
        
        setTimeout(() => location.reload(), 1000);
        
    } catch (erro) {
        alert(`Erro ao editar local: ${erro.message}`);
    }
}

async function excluirLocal() {
    const idExclusao = document.getElementById("idExclusao").value.trim();
    if (!idExclusao) {
        alert("Informe um ID válido para excluir");
        return;
    }

    if (!confirm(`Tem certeza que deseja excluir o local com ID ${idExclusao}?`)) {
        return;
    }

    try {
        const resposta = await fetchComRetry(`${URL}/${idExclusao}`, {
            method: 'DELETE'
        });

        let resultado;
        try {
            resultado = await resposta.json();
        } catch {
            resultado = { message: 'Local excluído' };
        }

        alert("Local excluído com sucesso!");
        
        setTimeout(() => location.reload(), 1000);
        
    } catch (erro) {
        alert(`Erro ao excluir local: ${erro.message}`);
    }
}

async function listarLocais() {
    try {
        const resposta = await fetchComRetry(URL);
        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        return [];
    }
}