var tags = [];
var skills = [];
var links = [];

// Populate all fields
$.getJSON("http://www.lufei.ca/project.json", function (data) {
	$.each(data.projects, function (id, project) {

		// Card
		tile = "<div class=\"card";
		for (i = 0; i < project.tags.length; i++) {
			tile += " " + project.tags[i];
		}
		tile += "\" id=\"";
		tile += project.id;
		tile += "\">";

		// Header
		tile += "<div class=\"card-header"
		if (project.link != "") tile += " hover"
		tile += "\">" + project.title + "</div>";

		// Image
		tile += "<img src=\"" + project.image + "\" class=\"card-img-top"
		if (project.link != "") tile += " hover"
		tile += "\" id=\"" + project.id + "-img\">";
		
		// Body
		tile += "<div class=\"card-body card-toggle hover\" id=\"" + project.id + "-details\">";
		// tile += "<h2 class=\"card-title\">" + project.title + "</h2>"
		tile += "<p class=\"card-text\">" + project.description + "</p>";
		tile += "</div>"; // end card body

		// Footer
		tile += "<div class=\"card-footer card-toggle hover\" id=\"" + project.id + "-footer\">";
		tile += "<table style=\"width:100%\"><tr><th style=\"text-align: left;\">"
		var i;
		project.skills.sort();
		for (i = 0; i < project.skills.length; i++) {
			tile += "<span class=\"badge badge-light\">" + project.skills[i] + "</span>&nbsp";
		}
		tile += "</th><th style=\"text-align: right;\"><i class=\"fa fa-sort-down\"></i></th></tr></table>"

		// End
		tile += "</div></div>";
		$("#content_wrapper").append(tile);
	});

	$(".card-body").hide();
});


// Generate tag array
$.getJSON("http://www.lufei.ca/project.json", function (data) {
	// iterate through all projects
	$.each(data.projects, function (id, project) {
		var i;
		// iterate through all tags
		for (i = 0; i < project.tags.length; i++) {
			if (tags.includes(project.tags[i]) == false && project.tags[i] != "") {
				// add to list if not found
				tags.push(project.tags[i]);
			}
		}
	});

	// generate buttons for each tag
	$.each(tags, function (i, tag) {
		var tag_btn = "<th style=\"padding: 0;\"><button class=\"filterbtn btn\" id=\"" + tag + "\">" + tag + "</button></th>";
		$("#filters").append(tag_btn);
	});

	// filter according to tag
	$(".filterbtn").click(function () {
		var tag_selected = this.id;
		$(".card").hide();
		$(".card").filter('.' + tag_selected).fadeIn();

		$("#All").removeClass("clicked_btn");
		$(".filterbtn").removeClass("clicked_btn");
		$(this).addClass("clicked_btn");
	});
});


// Generate skills array
$.getJSON("http://www.lufei.ca/project.json", function (data) {
	$.each(data.projects, function (id, project) {
		var i;
		for (i = 0; i < project.skills.length; i++) {
			if (skills.includes(project.skills[i]) == false) {
				skills.push(project.skills[i]);
			}
		}
	});
});

// Generate links array
$.getJSON("http://www.lufei.ca/project.json", function (data) {
	$.each(data.projects, function (id, project) {

		links.push(project.link);

	});
});


$(document).ready(function () {
	$("#All").click(function () {
		$(".card").fadeIn();
		$(this).addClass("clicked_btn");
		$(".filterbtn").removeClass("clicked_btn");
	});

	$("#topbtn").click(function () {
		jQuery('html,body').animate({
			scrollTop: 0
		}, 0);
	});

	$(".card-toggle").click(function () {
		var cardId = this.id;
		$("#" + cardId.replace("footer", "details")).animate(
			{height: "toggle"}
		);
	});

	$(".card-img-top").click(function() {
		var cardId = parseInt(this.id.replace("-img", ""));
		if (links[cardId] != "") window.open(links[cardId], "_blank");
	})
});


$(document).scroll(function () {
	// Identify scrolled distance
	var y = $(this).scrollTop();

	var trigger = 100;

	if (y >= (trigger)) {
		$('#topbtn').fadeIn();
	} else {
		$('#topbtn').fadeOut();
	}
});