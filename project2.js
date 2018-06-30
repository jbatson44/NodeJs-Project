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
	getUser(request, response);
});
app.get('/makeUser', function(request, response) {
	makeUser(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function getUser(request, response) {
	//var requestUrl = url.parse(request.url, true);
	var id = request.query.userid;
	//pool.query('SELECT * FROM users', (err, res) => {
	console.log("Logging in!")
	getUserFromDb(id, function(error, result) {
		console.log("We're back! ", result[0]);
		
		var username = result[0].username;
		var firstName = result[0].firstname;
		var lastName = result[0].lastname;
		var email = result[0].email;
		var gender = result[0].gender;
		var city = result[0].city;
		var state = result[0].state;
		var param = {userid: id, username: username, firstName: firstName, lastName: lastName, email: email, gender: gender, city: city, state: state};
		response.render('pages/chat', param);
	});
	
}
function getUserFromDb(id, callback) {
	console.log("getUserFromDb called ", id);
	var sql = "SELECT username, firstName, lastName, email, gender, city, state FROM users WHERE userid = $1::int";
	var params = [id];
	
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
	
}

