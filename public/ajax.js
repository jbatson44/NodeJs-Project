function getFriends() {
	
	var search = $("input[name=search]").val();
	//alert("getting some new friends like " + search);
	var param = {search: search};
	
	$.post("/getAllUsers", param, function(result) {	
		//alert("size of array " + result.length);
		var people = "<table>";
		for (var i = 0; i < result.length; i++) {
			newString = "<tr><td>" + result[i].username + "</td><td><input type='button' value='Add'></td></tr>";
			people += newString;
		}
		people += "</table>";
		$('#new').html(people);
	});
}
function getMessages() {
	alert("Time to get messages");
	$.post("/getMessages", function(result) {
		alert("messages " + JSON.stringify(result));
	});
}