# ADR 0001 - Expo Android First

## Status

Aceita.

## Contexto

O MC Companion e um app mobile para consultar exports uNmINeD durante partidas Minecraft. O primeiro fluxo critico e selecionar/importar uma pasta de export no dispositivo.

## Opcoes

- Expo/React Native Android first.
- React Native bare Android/iOS desde o inicio.
- App web/PWA.
- Projeto agnostico sem stack definida.

## Decisao

Usar Expo/React Native com Android como unica plataforma do MVP.

## Consequencias

- O design pode focar em permissoes, storage e WebView no Android.
- iOS fica explicitamente fora do MVP.
- Expo acelera setup e iteracao, mas pode limitar algumas APIs nativas de filesystem/static server.
- Se o static server local exigir nativo fora do managed workflow, a decisao devera ser reavaliada.
