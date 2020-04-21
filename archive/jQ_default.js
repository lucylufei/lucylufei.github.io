$(document).ready(function() {
 /*   $("#searchIcon").click(function(){
        $("#search_field").toggle();
		document.getElementById("search_field").value = "";
		clear_search();
	}); */
	$("#search_field").keyup(function() {
		var search = $.trim(this.value);
		hide_divs(search);
	});
	
});
$(document).click(function(e) {   
    if(e.target.id == "searchIcon" || e.target.id == "search_div") {
        $("#search_field").toggle();
		document.getElementById("search_field").value = "";
		clear_search();
	}
	else if (e.target.id == "search_div" || e.target.id == "search_field") {
	}
	else {
        hide_search();
		clear_search();
		document.getElementById("search_field").value = "";
    } 
});