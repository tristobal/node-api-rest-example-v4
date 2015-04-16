var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var methodOverride  = require("method-override");
var mongoose        = require('mongoose');


// Middlewares
app.use( bodyParser.urlencoded({ extended : true }) );
app.use( bodyParser.json() );
app.use( methodOverride() );

//Ruta main
var router = express.Router();
router.get('/', function(req, res) {
    res.send("Hello world!");
});
app.use(router);


//Conexión a BDD
//mongoose.connect('mongodb://user_db:pass_db@ds029051.mongolab.com:29051/mongotest', function(err, res) {
mongoose.connect('mongodb://localhost/jwttest', function(err, res) {
    if(err) {
        throw err;
    } else {
        console.log("Connected to Database");
    }
});

//Modelos
var TVShowModel = require("./models/tvshow.js")(app, mongoose);
var UserModel = require("./models/user.js")(app, mongoose);

//Controladores
var TVShowCtrl = require("./controllers/tvshows.js");
var UserCtrl = require("./controllers/users.js");


var middleware = require('./middleware');

//Rutas API Privadas
var router = express.Router();
router.use(middleware.ensureAuthenticated);
router.get('/tvshows', TVShowCtrl.findAllTVShows);
router.post('/tvshows', TVShowCtrl.addTVShow);
router.get('/tvshows/:id', TVShowCtrl.findById);
router.put('/tvshows/:id', TVShowCtrl.updateTVShow);
router.delete('/tvshows/:id', TVShowCtrl.deleteTVShow);
app.use('/api', router);

//Rutas API Públicas
var publicRouter = express.Router();
publicRouter.route('/token').post(UserCtrl.getUser);
publicRouter.route('/user').post(UserCtrl.addUser);
app.use('/public', publicRouter);

//Servidor
var port = process.env.PORT || 3000 ;
app.listen(port, function(){
    console.log("Node server running.");
});
