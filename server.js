const express = require('express'); 
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server); // Até aqui são as configurações padrões para utilizar tudo, express, socket.io etc...

app.use(express.static(path.join(__dirname,'public')));//definindo será utilizado nossos arquivos públicos
app.set('views', path.join(__dirname,'public'));
app.engine('html', require('ejs').renderFile );
app.set('view engine', 'html'); // irá ver o html da página

app.use('/', (req,res) => { // irá utilizar tudo dps da barra como index.html
    res.render('index.html');
});

let messages = []; // array criado para armazenar uma mensagem sem banco de dados

io.on('connection',socket => { // conexão com o socket.io
    console.log(`Socket Conectado: ${socket.id}`); // mostra o id, propriedade do soket

    socket.emit('previousMessages',messages); // envia para o FRONT-END essa chamada e ele executa lá

    socket.on('sendMessage', data => { // recebe o sendMessage e uma função
        messages.push(data); // adiciona ao array das messagens antes de falar que foi recebida
        socket.broadcast.emit('receivedMessage',data); // mensagem recebida, envia o array para mostrar na parte do front-end
    }) 
})

server.listen(3000); // irá se comunicar apenas pela porta 3000 do localhost