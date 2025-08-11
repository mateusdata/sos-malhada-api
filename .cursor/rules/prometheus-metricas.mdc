# Consulta de Métricas Prometheus
Sempre que for solicitado consultar métricas do Prometheus, o agente deve:
1. Chamar a tool `context-prometheus` para carregar o contexto das métricas disponíveis, seus formatos e regras de negócio.
2. Só então seguir o fluxo normal de consulta usando as demais tools relacionadas a Prometheus.

Essa ordem deve ser seguida para garantir que o contexto das métricas seja considerado em todas as análises e consultas.
description:
globs:
alwaysApply: false
---
