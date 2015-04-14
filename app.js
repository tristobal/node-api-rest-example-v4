var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose');

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
mongoose.connect('mongodb://user_db:pass_db@ds029051.mongolab.com:29051/mongotest', function(err, res) {
  if(err) {
    throw err;
  } else {
    console.log("Connected to Database");
  }
});

//Modelos
var models = require("./models/tvshow.js")(app, mongoose);


//Controlador
var TVShowCtrl = require("./controllers/tvshows.js");


//Rutas API
var tvshows = express.Router();

tvshows.route('/tvshows')
  .get(TVShowCtrl.findAllTVShows)
  .post(TVShowCtrl.addTVShow);

tvshows.route('/tvshows/:id')
  .get(TVShowCtrl.findById)
  .put(TVShowCtrl.updateTVShow)
  .delete(TVShowCtrl.deleteTVShow);

app.use('/api', tvshows);

//Servidor
app.listen(process.env.PORT, function(){
  console.log("Node server running.");
});
