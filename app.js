var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    todoliste = [], // stocke la todolist
    bodyParser = require('body-parser'),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');

/* permet d'utiliser body dans la request */
app.use(bodyParser());

/* On affiche la todolist et le formulaire */
app.get('/todo', function(req, res) {     
    res.render('todo.ejs', todoliste);
})
 
/* On ajoute un élément à la todolist et le stoche dans newtodo*/
.post('/todo/ajouter/', function(req, res) {
    if (req.body.newtodo != '') {
        todoliste.push(ent.encode(req.body.newtodo));
    }
    res.redirect('/todo');
})
 
/* Supprime un élément de la todolist */
.get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        todoliste.splice(ent.encode(req.params.id), 1);
    }
    res.redirect('/todo');
})
 
/* On redirige vers la todolist si la page demandée n'est pas trouvée */
.use(function(req, res, next) {
    res.redirect('/todo');
});
 
server.listen(8080);

/* on lance l'écoute sur la connexion d'un nouvel utilisateur */
io.sockets.on('connection', function (socket, pseudo) {
    // On met a jour tous les clients
    io.sockets.emit("miseajour", todoliste);
});