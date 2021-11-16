// user.js file for user authentication

const crypto = require('crypto');
const mongoose = require('mongoose');
const pbkdf2 = require('pbkdf2');
const { Schema } = mongoose;

const passport = require('passport')
const Srategy = require('password-http').BasicStrategy;

// Connect to the database
// CHANGE THIS TO YOUR DB CONNECTION UNLESS YOU ARE TESTING AGAINST MINE.
const uri = "mongodb+srv://user:user@cluster0.pnwwl.mongodb.net/notesapi?retryWrites=true&w=majority"
try {
	mongoose.connect(uri);
} catch (err){
	console.log(err);
}

const userSchema = new Schema({
	username: {
		type: String,
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

// BE SURE TO CHANGE THIS TO YOUR DESIRED PASSWORD.
let clearText = "51Rebel";
let salt = crypto.randomBytes(32).toString('hex');
let password = pbkdf2.pbkdf2Sync(clearText, salt, 1, 32, 'sha512').toString('hex');

// CHANGE 'MRW' TO THE USERNAME YOU WISH TO USE.
const User = mongoose.model('User', userSchema);
let add = new User({
	username: 'TylerRebel',
	password: password,
	salt: salt
});


// add.save();