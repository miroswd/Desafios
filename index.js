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

  -- 
    criar um middleware para verificar se existe o projeto baseado no id passado

    criar um middleware global para contar o número de requisições
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
let num = 0

/***** Middlewares *****/

// Verifica a existência do projeto

function projectExists(req,res,next){
  // Verificar se o id existe cadastrado no array

  const {id} = req.params
  const project = projects.find(proj => proj.id == id)

  if (!project) {
    return res.status(404).json({error:'The project not exists'})
  } return next()
}

// Impede a criação de projetos com o mesmo id
function projectCreated(req,res,next){
  
  const {id} = req.body
  const project = projects.find(proj => proj.id == id)

  if(project){
    return res.status(400).json({error:'The project already exists'})
  } return next()

}

// Contar requisições
function reqCount(req,res,next){
  num++ 
  console.log(num)
  return next()
}



server.use(reqCount) // Middleware Global


/*****  Cria o projeto  *****/
server.post('/create/project', projectCreated, (req,res) => {

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
server.put('/title/:id', projectExists,(req,res) => {
  const {id} = req.params
  const {newTitle} = req.body

  // Achar o campo title dentro do projeto do id e substituir
  const project = projects.find(proj => proj.id == id)
  project.title = newTitle
  return res.json(project)
})

/***** Deletar o projeto *****/
server.delete('/delete/:id', projectExists, (req,res) => {
  const {id} = req.params
  const project = projects.findIndex(proj => proj.id == id)
  // Deletando baseado no index
  projects.splice(project,1)
  return res.json("Projeto deletado")

})

/***** Adicionando tarefas no projeto *****/
server.post('/:id/tasks', projectExists, (req,res) => {
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