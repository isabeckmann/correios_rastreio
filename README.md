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

npm install express sqlite3 sqlite axios dotenv p-retry
npm install --save-dev jest nock

## Para o rastreio funcionar, você precisa de uma chave de API real. Crie um arquivo chamado .env na raiz do projeto e insira suas credenciais:
# .env
# Porta do Servidor
PORT=3000
# Credenciais da API Externa
RASTREIO_USER="seu_usuario" 
RASTREIO_TOKEN="<SUA CHAVE API COMPLETA AQUI>" 
NODE_ENV=development

### Inicialização

Na raiz do projeto, execute:
npm start

### 🗺️ Endpoints da API
Acesse estes endpoints via Postman ou Insomnia em http://localhost:3000/.
| Método | EndPoint | Descrição |
| :--- | :--- | :--- |
| **GET** | /api/health | Verifica a saúde da aplicação |
| **POST** | /api/frete | Calcula o valor do frete entre dois CEPs (usando mock interno) |
| **POST** | /api/rastrear | Rastreia uma encomenda via API externa (Requer Authorization Header com Apikey <TOKEN>) |
| **GET** | /api/historico | Retorna todas as consultas de frete e rastreio persistidas no SQLite |

### 💾 Persistência de Dados (SQLite)
Todas as consultas de /api/frete e /api/rastrear são persistidas no banco de dados SQLite (db/correios.db) na tabela historico.
| Coluna | Tipo | Descrição |
| :--- | :--- | :--- |
| **id** | INTEGER | Chave primária auto incrementada |
| **tipo** | TEXT | Tipo de consulta (frete ou rastreio) |
| **codigo** |TEXT | Código de rastreio |
| **origem** | TEXT | CEP de origem |
| **destino** | TEXT | CEP de destino |
| **data_consulta** | TEXT | Timestamp da consulta |
| **resposta** | TEXT | Conteúdo JSON completo da resposta da API |

### ✅ Testes de Validação Automática
Os testes validam a arquitetura, a persistência e o critério de Tolerância a Falhas simulando erros de rede (500 Internal Server Error) com nock.
Execute:
npm test
