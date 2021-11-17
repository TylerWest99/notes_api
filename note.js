/**
 * Functions for the note routes.
 *
 */

// Pull in the mongoose library.
const mongoose = require('mongoose');

// Grab the Schema object.
const { Schema } = mongoose;

// Make a new Schema for what we wish a Note
// to look like.
const noteSchema = new Schema({
	noteId: mongoose.ObjectId,
	userId: String,
	subject: String,
	course: Number,
	date: { type: Date, default: Date.now },
	note: String
});

// "Compile" the Schema into a model.
const Note = mongoose.model('Note', noteSchema);

// Create the function for getting ALL the notes.
// export it so we can use it in app.js.
exports.getAll = async function(req, res) {
	const notes = await Note.find({
		userId : req.user._id
	});
	res.json(notes);
}

// Create the getOne function.
// export it so we can use it in app.js.
exports.getOne = async function(req, res){
	// The getOne function searches the note field in
	// all of our notes for a search term.  It returns
	// all the notes that match.
	// We are using a regex to search.
	const notes = await Note.find({ 
		note: { 
			$regex: req.params.searchTerm,
			userId : req.user._id
		}
	});
	
	// If there are none that match, send a 404.
	if(notes.length == 0){
		res.sendStatus(404);
		return;
	}

	// Else, send the results back as json.
	res.json(notes);
}

// Create the function for creating a new note.
// export is so we can use it in app.js.
exports.postOne = async function(req, res){
	const note = new Note({
		userId: req.user._id,
		subject: req.body.subject,
		course: req.body.course,
		note: req.body.note
	});

	let error = note.validateSync();
	if(error){
		res.sendStatus(400);
		console.log(error);
		return;
	}
	note.save();
    res.sendStatus(200);
    //console.log("Successful POST")
	return;
}

exports.deleteOne = async function(req, res){
    try{
        const deleted = await Note.deleteOne({_id: req.params.objectId}) 
        res.sendStatus(200)
		console.log("Successful DELETE")
    }
    catch{
        res.sendStatus(404)
        console.log("Error resource not found")
    }
}

exports.putOne = async function(req, res){
     try{
        const result = await Note.replaceOne({_id: req.params.objectId}, 
			{
			subject: req.body.subject, 
			course: req.body.course, 
            note: req.body.note})
        if(result.matchedCount >= 1){
            res.sendStatus(200)
            console.log("Successful PUT")
        }
    }catch{
        res.send(404)
        console.log("Resource not found")
    }
}

//FIX THIS
exports.updateOne = async function(req, res){
	try{

	const result = await Note.findByIdAndUpdate(req.params.objectId, req.body)
	res.sendStatus(200)
	}
	catch{
		res.sendStatus(404)
		console.log("resource not found")
	}
}