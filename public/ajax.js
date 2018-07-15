function getFriends() {
	
	var search = $("input[name=search]").val();
	alert("getting some new friends like " + search);
	var param = {search: search};
	
	$.post("/getAllUsers", param, function(result) {
		if (result && result.success) {
			$("#status").text("Possible new friends!");
			alert("friend results ajax " + result);
		} else {
			$("#status").text("Error finding users!");
		}
	});
}