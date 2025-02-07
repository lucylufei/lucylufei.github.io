var tags = [];
var skills = [];
var links = [];

// Populate all fields
$.getJSON("https://www.lufei.ca/project.json", function (data) {
	$.each(data.projects, function (id, project) {

		// Card
		// <div class="tile [PROJECT-TAGS]" id="[PROJECT-ID]">
		tile = "<div class=\"tile";
		for (i = 0; i < project.tags.length; i++) {
			tile += " " + project.tags[i];
		}
		tile += "\" id=\"";
		tile += project.id;
		tile += "\">";

		// Project link
		// <a href="[PROJECT-LINK] target="_blank">
		if (project.link != "") {
			tile += "<a href=\"" + project.link + "\" target=\"_blank\">"
		}
		
		// DESKTOP-VERSION
		// Add image
		// <table><tr><td rowspan="3" class="image"><img src="[PROJECT-IMAGE]" style="width: 100%;"></td>
		tile += "<table class=\"desktop-only\"><tr><td rowspan=\"3\" class=\"image\"><img src=\"" + project.image + "\" style=\"width: 100%;\"></td>"

		// Project title
		// <th colspan="2">[PROJECT-TITLE]</th></tr>
		tile += "<th colspan=\"2\">" + project.title + "</th></tr>"

		// Project description
		// <tr><td colspan="2">[PROJECT-DESCRIPTION]</td></tr>
		tile += "<tr><td colspan=\"2\">" + project.description + "</td></tr>"

		// Project badges
		// <tr><td style="vertical-align: bottom;">
		// <span class="badge">[BADGE]</span>
		// </td><td style="vertical-align: bottom; text-align: right; padding-right: 1em; color: gray;"><i>year</i></td></tr>
		tile += "<tr><td style=\"vertical-align: bottom;\">"
		project.skills.sort();
		var i;
		for (i = 0; i < project.skills.length; i++) {
			tile += "<span class=\"badge\">" + project.skills[i] + "</span>";
		}
		tile += "</td><td style=\"vertical-align: bottom; text-align: right; padding-right: 1em; color: gray;\"><i>" + project.year + "</i></td></tr>"

		// End
		// </table>
		tile += "</table>"


		// MOBILE VERSION
		// Add image
		// <table><tr><td class="image"><img src="[PROJECT-IMAGE]" style="width: 100%;"></td></tr>
		tile += "<table class=\"mobile-only\"><tr><td class=\"image\"><img src=\"" + project.image + "\" style=\"width: 100%;\"></td></tr>"

		// Project title
		// <tr><th>[PROJECT-TITLE]</th></tr>
		tile += "<tr><th>" + project.title + "</th></tr>"

		// Project description
		// <tr><td>[PROJECT-DESCRIPTION]</td></tr>
		tile += "<tr><td>" + project.shortdesc + "</td></tr>"

		// Project badges
		// <tr><td style="vertical-align: bottom;">
		// <span class="badge">[BADGE]</span>
		// </td></tr>
		tile += "<tr><td style=\"vertical-align: bottom;\">"
		project.skills.sort();
		var i;
		for (i = 0; i < project.skills.length; i++) {
			tile += "<span class=\"badge\">" + project.skills[i] + "</span>";
		}
		tile += "</td></tr>"

		// End
		// </table>
		tile += "</table>"

		// End
		// </a></div>
		if (project.link != "") {
			tile += "</a>"
		}
		tile += "</div>"
		$("#content_wrapper").append(tile);
	});
});


// Generate tag array
$.getJSON("https://www.lufei.ca/project.json", function (data) {
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
		$(".tile").hide();
		$(".tile").filter('.' + tag_selected).fadeIn();

		$("#All").removeClass("clicked_btn");
		$(".filterbtn").removeClass("clicked_btn");
		$(this).addClass("clicked_btn");
	});
});


// Generate skills array
$.getJSON("https://www.lufei.ca/project.json", function (data) {
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
$.getJSON("https://www.lufei.ca/project.json", function (data) {
	$.each(data.projects, function (id, project) {
		links.push(project.link);
	});

	$(document).ready(function () {
		$("#All").click(function () {
			$(".tile").fadeIn();
			$(this).addClass("clicked_btn");
			$(".filterbtn").removeClass("clicked_btn");
		});
	
		$("#topbtn").click(function () {
			jQuery('html,body').animate({
				scrollTop: 0
			}, 0);
		});
	});
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