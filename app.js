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


//Controlador
var TVShowCtrl = require("./controllers/tvshows.js");
var UserCtrl = require("./controllers/users.js");


//Rutas API
var router = express.Router();

var middleware = require('./middleware');

router.route('/tvshows')
    .get(middleware.ensureAuthenticated, TVShowCtrl.findAllTVShows)
    .post(middleware.ensureAuthenticated, TVShowCtrl.addTVShow);

router.route('/tvshows/:id')
    .get(TVShowCtrl.findById)
    .put(TVShowCtrl.updateTVShow)
    .delete(TVShowCtrl.deleteTVShow);

router.route('/user')
    .post(UserCtrl.addUser);

router.route('/token')
    .post(UserCtrl.getUser);

app.use('/api', router);

//Servidor
var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Node server running.");
});
