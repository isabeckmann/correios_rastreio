# 📦 Microserviço de Rastreio e Frete dos Correios

Este projeto implementa um microserviço robusto para gerenciamento de consultas de frete e rastreamento de encomendas, utilizando a arquitetura de serviços separados, persistência em SQLite e mecanismos de tolerância a falhas (`p-retry`).

## ⚙️ Arquitetura e Tecnologias

O projeto adere à arquitetura de microsserviços, separando responsabilidades em Controladores, Serviços e Base de Dados.

| Componente | Tecnologia/Padrão | Descrição |
| :--- | :--- | :--- |
| **Linguagem** | Node.js (ES Modules) | Ambiente de execução |
| **Framework** | Express | Criação da API RESTful |
| **Banco de Dados** | SQLite | Banco de dados embutido (`correios.db`) para histórico e persistência |
| **Serviço HTTP** | Axios | Cliente HTTP para chamadas a APIs externas |
| **Tolerância a Falhas** | `p-retry` | Implementação de retry exponencial para lidar com falhas temporárias de rede. |
| **Testes** | Jest & `nock` | Framework de testes e mock de requisições HTTP para simular falhas e garantir a tolerância a falhas. |

## 🚀 Como Executar o Projeto

### Pré-requisitos

* Node.js (versão 18+)
* Gerenciador de pacotes NPM

### Instalação

Na raiz do projeto, execute:

```bash
npm install
