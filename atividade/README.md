# Atividade

1) Altere o "exemplo02", permitindo que o usuário informe a descrição, o endereço e URL (opcional) do local. Refatore o exemplo, permitindo o reaproveitamento de código. Por exemplo: eliminando as repetições do trecho de código abaixo:

```js
let popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h3><a href="${local.url}" target="_blank">${local.descricao}</a></h3>
              <br>${local.endereco} 
              <br> ${local.cidade}`);
const marker = new mapboxgl.Marker({ color: local.cor })
    .setLngLat(local.latlong)
    .setPopup(popup)
    .addTo(map);

```