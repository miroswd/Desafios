// Aplicação para armazenamento de projetos e tarefas

/*
    criar um servidor +
    criar uma rota de testes  +
    criar as rotas
      post   -> Recebe id e title {"id":"1","title":"Novo Projeto","tasks":[]}
      get    -> Listar todos os projetos e respectivas tarefas
      put    -> Alterar apenas o título do projeto
      delete -> Deleta o projeto
      post   -> Adiciona tarefas
*/

const express = require('express');
const server = express();

server.use(express.json());
/* 

    ESTRUTURA FRONTEND

{
  "id": 1,
  "title":"Novo Projeto",
  "tasks":[
    "Create",
    "Read",
    "Update",
    "Delete"
  ]

}*/


const projects = [];

/*****  Cria o projeto  *****/
server.post('/create/project',(req,res) => {

  // Sem validação de dados
  const {id,title,tasks} = req.body
  projects.push({id,title,tasks})
  return res.json({id,title,tasks})

})

/***** Lista todos os projetos *****/
server.get('/projects', (req,res) => {
  return res.json(projects)
})

/***** Altera apenas o título *****/
server.put('/title/:id',(req,res) => {
  const {id} = req.params
  const {newTitle} = req.body

  // Achar o campo title dentro do projeto do id e substituir
  const project = projects.find(proj => proj.id == id)
  project.title = newTitle
  return res.json(project)
})

/***** Deletar o projeto *****/
server.delete('/delete/:id', (req,res) => {
  const {id} = req.params
  const project = projects.findIndex(proj => proj.id == id)
  // Deletando baseado no index
  projects.splice(project,1)
  return res.json("Projeto deletado")

})

/***** Adicionando tarefas no projeto *****/
server.post('/:id/tasks', (req,res) => {
  const {id} = req.params
  const {task} = req.body
  const projectIndex = projects.findIndex(proj => proj.id == id)
  projects[projectIndex].tasks.push(task)
  return res.json(projects)
})

/* Rota de teste inicial
server.get('/teste', (req,res) => {
  return res.send('Bom dia')
})*/

server.listen(3000);