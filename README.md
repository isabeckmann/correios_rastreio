Configuração de Variáveis de AmbientePara o rastreio funcionar, você precisa de uma chave de API real. Crie um arquivo chamado .env na raiz do projeto e insira suas credenciais:# .env

# Porta do Servidor
PORT=3000

# Credenciais da API Externa (Ex: Wonca Labs)
# USUÁRIO: reuso_software
RASTREIO_USER="reuso_software" 
RASTREIO_TOKEN="<SUA CHAVE API COMPLETA AQUI (ex: q457_qk0...)>" 

NODE_ENV=development
InicializaçãoPara iniciar o servidor, execute:Bashnpm start
O servidor será inicializado e deve retornar ServiçoEntregas UP no endpoint /api/health.🗺️ Endpoints da APIAcesse estes endpoints via Postman ou Insomnia em http://localhost:3000/.MétodoEndpointDescriçãoGET/api/healthVerifica a saúde da aplicaçãoPOST/api/freteCalcula o valor do frete entre dois CEPs (usando mock interno)POST/api/rastrearRastreia uma encomenda via API externa (Requer Authorization Header com Apikey <TOKEN>)GET/api/historicoRetorna todas as consultas de frete e rastreio persistidas no SQLiteExemplo de Requisição (Rastreio)Para testar a integração real, use a sua chave no Authorization do Postman:POST /api/rastrearJSON{
    "codigo": "AA123456789BR"
}
💾 Persistência de Dados (SQLite)Todas as consultas de /api/frete e /api/rastrear são persistidas no banco de dados SQLite (db/correios.db) na tabela historico.Estrutura da Tabela historicoColunaTipoDescriçãoidINTEGERChave primária auto incrementadatipoTEXTTipo de consulta (frete ou rastreio)codigoTEXTCódigo de rastreioorigemTEXTCEP de origemdestinoTEXTCEP de destinodata_consultaTEXTTimestamp da consultarespostaTEXTConteúdo JSON completo da resposta da API✅ Testes de Validação AutomáticaOs testes validam a arquitetura, a persistência e o critério de Tolerância a Falhas simulando erros de rede (500 Internal Server Error) com nock.Execução dos TestesRenomeie: Certifique-se de que o arquivo src/tests/serviceTests.js está renomeado para serviceTests.test.js.Execute:Bashnpm test
(É necessário que o package.json contenha o script test).
---

O único passo restante para a conclusão total do projeto é a **validação final** com o Jest.

Gostaria de renomear o arquivo de teste para `serviceTests.test.js` e rodar o `npm tes
