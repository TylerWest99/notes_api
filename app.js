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

const passport = require('passport')
const Strategy = require('passport-http').BasicStrategy;
const pbkdf2 = require('pbkdf2')
const { Schema } = mongoose;

//Auth 
//Authentication
const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	salt: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const User = mongoose.model('User', userSchema);

passport.use(new Strategy(
	function(username, password, done){
		username.findOne({ username: username }, function(err, user){
			//cant connect db
			if(err){
				return done(err);
			}
			if(!user){
				console.log("No user found")
				return done(null, false);
			}

			if(!validPassword(password, user.salt, user.password)){
				console.log('Wrong password')
				return done(null, false);
			}

			return done(null, user)
		});
	}
));

const validPassword = function(password, salt, hash){
	let key = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512');

	if(key.toString('hex') != hash){
		return false;
	}
	return true;
}

// Connect to the database
const uri = 'mongodb+srv://user:user@cluster0.pnwwl.mongodb.net/notesapi?retryWrites=true&w=majority'
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
app.get('/notes/:searchTerm', checkAuth, note.getOne);
app.post('/notes', note.postOne);
app.delete('/notes/:objectId', note.deleteOne);
app.put('/notes/:objectId', note.putOne);
app.patch('/notes/:objectId', note.updateOne)


// Start it up!
app.listen(port, () => {
	console.log(`Up and running on port ${port}.`);
});