/*const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/
var express = require('express');
var app = express();
var url = require('url');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getRate', function(request, response) {
	getRate(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function getRate(request, response) {
	var requestUrl = url.parse(request.url, true);

	console.log("Query parameters: " + JSON.stringify(requestUrl.query));

	var weight = Number(requestUrl.query.weight);
	var type = requestUrl.query.mail_type;
	
	if ((type == "Letters (Stamped)") && (weight > 3.5)){
		response.write("<p>Cannot weigh more than 3.5oz!</p>");
	}

	calculateRate(response, type, weight);
}

function calculateRate(response, type, weight) {
	var cost = 0;
	if (type == "Letters (Stamped)") {
		cost = .5;
		if (weight > 1){
			cost = cost + .21;
		}
		if (weight > 2){
			cost = cost + .21;
		}
		if (weight > 3){
			cost = cost + .21;
		}
	}
	else if (type == "Letters (Metered)") {
		cost = .47;
		if (weight > 1){
			cost = cost + .21;
		}
		if (weight > 2){
			cost = cost + .21;
		}
		if (weight > 3){
			cost = cost + .21;
		}
	}
	else if (type == "Large Envelopes (Flats)") {
		cost = 1;
		if (weight > 1){
			cost = cost + .21;
		}
		if (weight > 2){
			cost = cost + .21;
		}
		if (weight > 3){
			cost = cost + .21;
		}
		if (weight > 4){
			cost = cost + .21;
		}
		if (weight > 5){
			cost = cost + .21;
		}
		if (weight > 6){
			cost = cost + .21;
		}
		if (weight > 7){
			cost = cost + .21;
		}
		if (weight > 8){
			cost = cost + .21;
		}
		if (weight > 9){
			cost = cost + .21;
		}
		if (weight > 10){
			cost = cost + .21;
		}
		if (weight > 11){
			cost = cost + .21;
		}
		if (weight > 12){
			cost = cost + .21;
		}
	}
	else if (type == "First-Class Package Service-Retail") {
		cost = 3.5
		if (weight > 4){
			cost = cost + .25;
		}
		if (weight > 8){
			cost = cost + .35;
		}
		if (weight > 9){
			cost = cost + .35;
		}
		if (weight > 10){
			cost = cost + .35;
		}
		if (weight > 11){
			cost = cost + .35;
		}
		if (weight > 12){
			cost = cost + .35;
		}
	}
	var realCost = cost.toFixed(2);
	
	var params = {type: type, cost: realCost, weight: weight};
	response.render('pages/result', params);

}
