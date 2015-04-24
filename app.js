var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var methodOverride  = require("method-override");
var mongoose        = require('mongoose');
var config          = require('./config');


//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8101');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Auth-Token');

    next();
};


// Middlewares
app.use( bodyParser.urlencoded({ extended : true }) );
app.use( bodyParser.json() );
app.use( methodOverride() );
app.use( allowCrossDomain );

//Ruta main
var router = express.Router();
router.get('/', function(req, res) {
    res.send("Hello world!");
});
app.use(router);


//Conexión a BDD
mongoose.connect(config.DATABASE_LOCAL, function(err, res) {
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
