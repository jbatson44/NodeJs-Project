var express = require('express');
var app = express();
var url = require('url');

const { Pool } = require('pg')
const conString = process.env.DATABASE_URL || 'postgres://chatuser:chatuser@localhost:5432/chatdata';
const pool = new Pool({connectionString: conString});
var session = require('express-session');
app.set('port', (process.env.PORT || 5000));

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use( bodyParser.json() );  

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.post('/getUser', function(request, response) {
	verifyUser(request, response);
	getUser(request, response);
});

app.post('/makeUser', function(request, response) {
	makeUser(request, response);
	verifyUser(request, response);
	getUser(request, response);
});

app.get('/sendMessage', function(request, response) {
	sendMessage(request, response);
	//getUser(request, response);
});

app.post('/getAllUsers', getAllUsers);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function verifyUser(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var sql = "SELECT username, password FROM users";
	var userExist = false;
	var passCorrect = false;
	pool.query(sql, function(err, results) {
		console.log("verifying...", results.rows);
		for (var i = 0; i < results.rows.length; i++) {
			if (username == results.rows[i].username) {
				userExist = true;
				console.log("User exists");
				if (password == results.rows[i].password) {
					passCorrect = true;
					console.log("password is correct");
					session.username = username;
					session.password = password;
					//getUser(request, response);
				} else {
					console.log("password is incorrect");
					var error = "ERROR: incorrect password";
					var param = {error: error};
					return response.render('pages/error', param);
				}
			
				
			}
			
		}
		if (passCorrect == false) {
			console.log("Username doesn't exist!");
			var error = "ERROR: username doesn't exist";
			var param = {error: error};
			return response.render('pages/error', param);
		}
	});
}

function getUser(request, response) {
	var requestUrl = url.parse(request.url, true);
	var id = request.query.userid;
	session.username = request.body.username;
	console.log("user", session.username);

	console.log("Logging in!")
	
	getUserFromDb(function(error, result) {
		console.log("We're back! ", result[0]); 
		
		session.userid = result[0].userid;
		session.firstName = result[0].firstname;
		session.lastName = result[0].lastname;
		session.email = result[0].email;
		session.gender = result[0].gender;
		session.city = result[0].city;
		session.state = result[0].state;
		var param = {userid: session.userid, username: session.username, firstName: session.firstName, lastName: session.lastName, email: session.email, gender: session.gender, city: session.city, state: session.state};
		return response.render('pages/chat', param);
	});
	
}
function getUserFromDb(callback) {
	console.log("getUserFromDb called ", session.username);
	var sql = "SELECT userid, firstName, lastName, email, gender, city, state FROM users WHERE username = $1";
	var params = [session.username];
	
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
function getAllUsers(request, response) {
	//var result = {success: false};
	var search = request.body.search;
	if (search == null)
		search = "DNC";
	console.log("Search: " + search);
	//var sql = "SELECT userId, username FROM users WHERE username LIKE '%" + search + "%'";
	//sql = "SELECT userId, username FROM users WHERE username = '" + search + "'";
	var sql = "SELECT userId, username FROM users";
	//if (search == "")
	//	sql = "SELECT * FROM users;"// WHERE username = '" + search + "'";
	pool.query(sql, function(err, result) {
		if(err) {
			console.log("ERROR: can't find friends ");
			console.log(err);
		} else {
			console.log("Found friends: " + JSON.stringify(result.rows));
			response.json(result.rows);
		}
	});
	
}

function makeUser(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var firstName = request.body.firstName;
	var lastName = request.body.lastName;
	var email = request.body.email;
	var state = request.body.state;
	var city = request.body.city;
	var gender = request.body.gender;
	console.log("attempting to insert: " + username);
	var sql = "INSERT INTO users(username, password, firstName, lastName, email, state, city, gender) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
	pool.query(sql, [username, password, firstName, lastName, email, state, city, gender]);
		//if (err) {
	//		console.log("ERROR: inserting" + err);
	//	}
		console.log("Insert successful");
	//});
}


