function getNewFriends() {
	
	var search = $("#search").val();
	//alert("getting some new friends like " + search);
	var param = {
		search: search
	};
	
	$.post("/getAllUsers", param, function(result) {	
		//alert("size of array " + result.length);
		var people = "<table>";
		for (var i = 0; i < result.length; i++) {
			newString = "<tr><td>" + result[i].username + "</td><td><input type='button' value='Add' onclick='addFriend()'></td></tr>";
			people += newString;
		}
		people += "</table>";
		$('#new').html(people);
	});
}
function getMessages() {
	$('#messages').scrollTop($('#messages')[0].scrollHeight - $('#messages')[0].clientHeight);
	//alert("Time to get messages");
	$.post("/getMessages", function(result) {
	//	alert("messages " + JSON.stringify(result));
		var mess = "<ul>";
		for (var i = 0; i < result.length; i++) {
			newString = "<li>" + result[i].message + "</li>";
			mess += newString;
		}
		mess += "</ul>";
		$('#messages').html(mess);
	});
}
function sendMessage() {
	var message = $("#message").val();
	var params = {
		message: message
	};
	$.post("/sendMessage", params, function(result) {

	});
	getMessages();
}
function addFriend() {
	console.log("Adding your new friend!");
}
function getFriends() { 
	$.post("/getFriends", function(result) {
		var fl = "";
		for (var i = 0; i < result.length; i++) {
			newString = "<p>" + result[i].username + "</p>";
			fl += newString;
		}
		//fl += "</ul>";
		$('#friends').html(fl);
	});
}