function goBack() {
    window.history.back();
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("topbtn").style.display = "block";
    } else {
        document.getElementById("topbtn").style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


function displaySearch() {
    var x = document.createElement("INPUT");
    x.setAttribute("type", "search");
    document.body.appendChild(x);
}


function hide_divs(search) {
	if (search != "") {
		$("#container > div").hide(); // hide all divs
		$('#container > div[id*="'+search+'"]').show(); // show the ones that match
	}
	else
		$("#container > div").show(); // show all divs
	
}

function clear_search() {
    $("#container > div").show(); // show all divs
}

function hide_search(){
	$("#search_field").hide();
}
