var gzippo = require('gzippo');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(gzippo.staticGzip("" + __dirname + "/dist"));
server.listen(process.env.PORT || 5000);

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku


// Навешиваем обработчик на подключение нового клиента
io.sockets.on('connection', function (socket) {
    // Т.к. чат простой - в качестве ников пока используем первые 5 символов от ID сокета
    var ID = (socket.id).toString().substr(0, 5);
    var time = (new Date).toLocaleTimeString();
    // Посылаем клиенту сообщение о том, что он успешно подключился и его имя
    socket.json.send({id: ID,'event': 'connected', 'time': time});
    // Посылаем всем остальным пользователям, что подключился новый клиент и его имя
    socket.broadcast.json.send({id: ID, 'event': 'userJoined', 'time': time});
    // Навешиваем обработчик на входящее сообщение
    socket.on('message', function (msg) {
        var time = (new Date).toLocaleTimeString();
        // Уведомляем клиента, что его сообщение успешно дошло до сервера
        socket.json.send({id: ID, 'event': 'messageSent', 'user': msg, 'time': time});
        // Отсылаем сообщение остальным участникам чата
        socket.broadcast.json.send({id: ID, 'event': 'messageReceived', 'user': msg, 'time': time})
    });
    // При отключении клиента - уведомляем остальных
    socket.on('disconnect', function() {
        var time = (new Date).toLocaleTimeString();
        io.sockets.json.send({id: ID, 'event': 'userSplit', 'time': time});
    });
});

