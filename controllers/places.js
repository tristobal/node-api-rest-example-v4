var mongoose = require("mongoose");

//Nombre del modelo definido en ../models/tvshow.js
var Place = mongoose.model("Place");

exports.getAll = function(req, res) {
    Place.find(function(err, tvshows) {
        if(err) {
            res.send(500, err.message);
        } else {
            console.log('GET /places');
            res.status(200).jsonp(tvshows);
        }
    });
};

exports.findById = function(req, res) {
    Place.findById(req.params.id, function(err, tvshow) {
        if(err) return res.send(500, err.message);

        console.log('GET /place/' + req.params.id);
        res.status(200).jsonp(tvshow);
    });
};

exports.add = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var place = new Place({
        name:         req.body.name,
        location:     req.body.location,
        address:      req.body.address,
        notes:        req.body.notes,
        author:       mongoose.Types.ObjectId(req.body.author),
        //creation:     req.body.creation,
        visited:      req.body.visited,
        geoplacedata: JSON.stringify(req.body.geoplacedata)
    });

    place.save(function(err, placeResp) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(placeResp);
    });
};

exports.update = function(req, res) {
    Place.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) {
            return res.send(500, err.message);
        } else if (post) {
            res.status(200).json({ message: 'Successfully updated' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    });

    /*
    Place.findById(req.params.id, function(err, place) {
        place.name =         req.body.name;
        place.location =     req.body.location;
        place.address =      req.body.address;
        place.notes =        req.body.notes;
        place.author =       mongoose.Types.ObjectId(req.body.author);
        //place.creation =     req.body.creation;
        place.visited =      req.body.visited;
        place.geoplacedata = JSON.stringify(req.body.geoplacedata);

        place.save(function(err) {
            if(err) return res.send(500, err.message);
            res.status(200).jsonp(place);
        });
    });
    */
};

exports.delete = function(req, res) {
    Place.findByIdAndRemove(req.params.id, function(err, post) {
        if (err) {
            return res.send(500, err.message);
        } else if (post) {
            res.status(200).json({ message: 'Successfully deleted' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    });
};
