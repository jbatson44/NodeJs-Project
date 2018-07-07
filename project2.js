var express = require('express');
var app = express();
var url = require('url');
//var pg = require('pg');
const { Pool } = require('pg')
const conString = process.env.DATABASE_URL || 'postgres://chatuser:chatuser@localhost:5432/chatdata';
const pool = new Pool({connectionString: conString});
app.set('port', (process.env.PORT || 5000));


app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getUser', function(request, response) {
	verifyUser(request, response);
	getUser(request, response);
});
app.get('/makeUser', function(request, response) {
	makeUser(request, response);
});
app.get('/sendMessage', function(request, response) {
	sendMessage(request, response);
	//getUser(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function verifyUser(request, response) {
	var username = request.query.username;
	var password = request.query.password;
	var sql = "SELECT username, password FROM users";
	pool.query(sql, function(err, results) {
		console.log("verifying...", results.rows);
		for (var i = 0; i < results.rows.length; i++) {
			if (username == results.rows[i].username) {
				console.log("User exists");
				if (password == results.rows[i].password) {
					console.log("password is correct");
				} else {
					console.log("password is incorrect");
				}
			} else {
				console.log("Username doesn't exist!");
			}
		}
	});
}

function getUser(request, response) {
	var requestUrl = url.parse(request.url, true);
	var id = request.query.userid;
	var username = request.query.username;
	console.log("user", username);
	//pool.query('SELECT * FROM users', (err, res) => {
	console.log("Logging in!")
	getUserFromDb(username, function(error, result) {
		console.log("We're back! ", result[0]);
		
		var userid = result[0].userid;
		var firstName = result[0].firstname;
		var lastName = result[0].lastname;
		var email = result[0].email;
		var gender = result[0].gender;
		var city = result[0].city;
		var state = result[0].state;
		var param = {userid: userid, username: username, firstName: firstName, lastName: lastName, email: email, gender: gender, city: city, state: state};
		response.render('pages/chat', param);
	});
	
}
function getUserFromDb(username, callback) {
	console.log("getUserFromDb called ", username);
	var sql = "SELECT userid, firstName, lastName, email, gender, city, state FROM users WHERE username = $1";
	var params = [username];
	
	pool.query(sql, params, function(err, result) {
		if(err) {
			console.log("ERROR: ");
			console.log(err);
			callback(err, null);
		}
		
		console.log("Found result: " + JSON.stringify(result.rows));
		
		callback(null, result.rows);
		
	});
}
function makeUser(request, response) {
	var username = request.query.username;
	var password = request.query.password;
	var firstName = request.query.firstName;
	var lastName = request.query.lastName;
	var email = request.query.email;
	var state = request.query.state;
	var city = request.query.city;
	var gender = request.query.gender;
	
	var sql = "INSERT INTO users(username, password, firstName, lastName, email, state, city, gender) VALUES $1, $2, $3, $4, $5, $6, $7, $8";
	pool.query(sql, username, password, firstName, lastName, email, state, city, gender, function(err, results) {
		console.log("Insert successful");
	});
}

function sendMessage(request, response) {
	var message = request.query.message;
	console.log("Sending message: " + message);
	var messages = request.query.messages;
	console.log("messages: " + messages);
	//var message = request.query.messages;
	//var ul = document.getElementById("messages");
	//var li = document.createElement("li");
	//var ul = request.query.messages;
	//var li = request.query.li;
	//li.appendChild(document.createTextNode(message));
	//ul.appendChild(li);
}


