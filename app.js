/**
 * Simple Note-Taking App.
 * Mr.W
 * 
 * VERY basic code to illustrate creating basic routes
 * and handlers.
 *
 */

// Set constants
const VERSION = "1.0.0";

// Import the libraries we need
const express = require('express');
const mongoose = require('mongoose');
const note = require('./note');

// Connect to the database
const uri = 'mongodb+srv://mrwoodring:BadPassword@cluster0.dxk6b.mongodb.net/XUniversity?retryWrites=true&w=majority'
try {
	mongoose.connect(uri);
} catch (err){
	console.log(err);
}

// Create the app instance
const app = express();
const port = 8080;

module.exports = { app, mongoose };

// Export any data we will need in other files
module.exports = { app, mongoose };

// Tell express to use the json body parser middleware
app.use(express.json());

// Set routes
app.get('/', function(req, res){
	res.send(`Simple note-taking app. Version ${VERSION}.`);
});

app.get('/notes', note.getAll);
app.get('/notes/:searchTerm', note.getOne);
app.post('/notes', note.postOne);
app.delete('/notes/:objectId', note.deleteOne);
app.put('/notes/:objectId', note.putOne);
app.patch('/notes/:objectId', note.updateOne)


// Start it up!
app.listen(port, () => {
	console.log(`Up and running on port ${port}.`);
});