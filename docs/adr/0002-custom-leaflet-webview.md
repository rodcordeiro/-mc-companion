# ADR 0002 - Leaflet em WebView Propria

## Status

Aceita.

## Contexto

O mapa do uNmINeD e composto por tiles raster e metadados. Leaflet e uma boa camada web para navegar tiles e desenhar overlays, mas React Native nao executa Leaflet diretamente como UI nativa.

## Opcoes

- Usar `expo-leaflet`.
- Criar WebView propria com HTML/JS Leaflet local.
- Renderizar mapa nativamente em React Native.
- Usar OpenLayers gerado pelo proprio uNmINeD em iframe/WebView.

## Decisao

Criar viewer Leaflet proprio em WebView. Nao usar `expo-leaflet` como dependencia arquitetural.

## Consequencias

- O app controla o `GridLayer` necessario para o formato de tiles do uNmINeD.
- A camada de mapa pode receber markers e comandos por bridge WebView.
- Evita depender de uma lib antiga e pouco mantida.
- Exige manter o HTML/JS do viewer dentro do projeto.
