var tags = [];
var skills = [];
// Populate all fields
$.getJSON("http://www.lufei.ca/projects.json", function(data){
    $.each(data.projects, function(id, project){
        tile = "<div class=\"tile col col-sm-12 col-lg-4 col-xl-3";
        for (i = 0; i < project.tags.length; i++){
                        tile += " " + project.tags[i];
        }
        tile += "\" id=\"";
        tile += project.id;
        tile += "\">";
        tile += "<div class=\"card\">";
        tile += "<div class=\"card-body\">";
        tile += "<img src=\"" + project.image + "\" class=\"card-img-top\">";
        tile += "<h2 class=\"card-title\">" + project.title + "</h1>";
        tile += "<p class=\"card-text\">" + project.description + "</p>";
        tile += "</div>"; // end card body
        tile += "<div class=\"card-footer\">";
        
        var i;
       	project.skills.sort();
        for (i = 0; i < project.skills.length; i++){
            tile += "<span class=\"badge badge-light\">" + project.skills[i] + "</span>&nbsp";
        }


        tile += "</div></div></div>";
        $("#content_wrapper").append(tile);
    });
});


// Generate tag array
$.getJSON("http://www.lufei.ca/projects.json", function(data){
	// iterate through all projects
	$.each(data.projects, function(id, project){
		var i;
		// iterate through all tags
		for (i = 0; i < project.tags.length; i++){
			if (tags.includes(project.tags[i]) == false){
				// add to list if not found
				tags.push(project.tags[i]);
			}
		}
	});
	
	// generate buttons for each tag
	$.each(tags, function(i, tag){
		var tag_btn = "<div class=\"col-2 col-md-auto\" style=\"padding: 0;\"><button class=\"filterbtn btn\" id=\"" + tag + "\">" + tag + "</button></div>";
		$("#filters").append(tag_btn);
	});

	// filter according to tag
	$(".filterbtn").click(function(){
		var tag_selected = this.id;
		$(".tile").hide();
		$(".tile").filter('.' + tag_selected).show();

		$("#All").removeClass("clicked_btn");
		$(".filterbtn").removeClass("clicked_btn");
		$(this).addClass("clicked_btn");
	});
});


// Generate skills array
$.getJSON("http://www.lufei.ca/projects.json", function(data){
	$.each(data.projects, function(id, project){
		var i;
		for (i = 0; i < project.skills.length; i++){
			if (skills.includes(project.skills[i]) == false){
				skills.push(project.skills[i]);
			}
		}
	});
});


$(document).ready(function(){
	$("#All").click(function(){
		$(".tile").show();
		$(this).addClass("clicked_btn");
		$(".filterbtn").removeClass("clicked_btn");
	});
});

