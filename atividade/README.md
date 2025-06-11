# Atividade

1) Altere o "exemplo02":

a) Permitindo que o usuário informe a descrição, endereço e URL (opcional) do local.

b) Refatorando o exemplo, para permitir o reaproveitamento de código. Por exemplo: eliminando as repetições que se assemelham ao trecho de código abaixo:

```js
let popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3>
                <a href="${local.url}" target="_blank">
                  ${local.descricao}
                </a>
              </h3>
              <br>${local.endereco} 
              <br> ${local.cidade}`);

const marker = new mapboxgl.Marker({ color: local.cor })
    .setLngLat(local.latlong)
    .setPopup(popup)
    .addTo(map);

```

c) Permitindo o armazenamento, leitura, alteração e exclusão dos dados no `JSONServer`. O `JSONServer` deve rodar no `Replit.com`.