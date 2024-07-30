f = open("hikes.csv", "r")

dataset = {}
regions = set()
for line in f.readlines()[1:]:
    content = line.strip().split(",")
    dataset[content[2]] = {
        "done" : content[0],
        "region" : content[1],
        "rating" : content[3],
        "rec" : content[4],
        "year": content[5],
        "comment" : ", ".join(content[6:]).replace('"', ''),
    }
    regions.add(content[1])

f.close()

def create_cards(dataset):
    hikes_list = sorted(dataset.keys())
    # hikes_list.sort(key=lambda x: dataset[x]["done"] == "Yes", reverse=True)

    for hike in hikes_list:
        print(hike)

        hike_done = (dataset[hike]["done"] == "Yes")
        num_stars = int(dataset[hike]["rec"]) - 2 if hike_done else 0
        region = dataset[hike]["region"]
        year = 0 if dataset[hike]["year"] == "" else int(dataset[hike]["year"])
        region_class = region.replace(" ", "-").replace("'", "").lower()
        
        if dataset[hike]["rating"] == "Easy":
            diff = "1"
        elif dataset[hike]["rating"] == "Moderate":
            diff = "2"
        elif dataset[hike]["rating"] == "Hard":
            diff = "3"
        else:
            diff = "4"

        f.write('<div class="card rate_{rating} {done}" data-name={name} data-region={region} data-rating={rating} data-est-year={year} data-difficulty={diff}>'.format(region=region_class, rating=str(num_stars), done="done" if hike_done else "", name=hike.replace(" ", "-").replace("'", "").lower(), year=year, diff=diff))
        if hike_done:
            # Add image
            f.write('<img src="./images/hikes/{img}.JPG" class="card-img-top" alt="...">'.format(img=hike.replace(" ", "-").replace("'", "").lower()))

            # Calculate star rating
            star_rating = ' <i class="fa fa-heart" aria-hidden="true"></i>' * num_stars
            star_rating += ' <i class="fa fa-heart-o" aria-hidden="true"></i>' * (3 - num_stars)

            # Add badges
            year_badge = '<span class="highlight est-year">{year}</span>'.format(year=year)
            rating_badge = '<span class="highlight rating">{rating}</span>'.format(rating=star_rating)
            difficulty_badge = '<span class="highlight difficulty-{rate}">{rating}</span>'.format(rate=dataset[hike]["rating"].lower() , rating=dataset[hike]["rating"])
            region_badge = '<span class="highlight region">{region}</span>'.format(region=region)

            badges = rating_badge + difficulty_badge + region_badge + year_badge

            # Make card
            f.write('<div class="card-body"><h5 class="card-title">{name}</h5><p class="card-text">{comment}</p>{badges}</div></div>\n'.format(name=hike, comment=dataset[hike]["comment"], badges=badges))
        else:
            region_badge = '<span class="highlight region">{region}</span>'.format(region=region)
            f.write('<div class="card-body"><h5 class="card-title" style="color: gray;">{name}</h5>{badges}</div></div>\n'.format(name=hike, rating=dataset[hike]["rating"], badges=region_badge))

    f.write("</div>")



f = open("../hikelog.html", "w+")

# Header
f.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Hike Log &#9829;</title>\n\n')

# Analytics
f.write("<script async src='https://www.googletagmanager.com/gtag/js?id=UA-102991991-2'></script><script>window.dataLayer = window.dataLayer || [];function gtag() {dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-102991991-2'); </script>\n\n")

# Files
f.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet"><link rel="icon" href="./images/L.png"><link rel="stylesheet" href="common.css"><link rel="stylesheet" href="hikes.css"><link rel="stylesheet" href="topbutton.css"><script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>\n\n')

# Analytics
f.write("<script>(function (i, s, o, g, r, a, m) {i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {(i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1 * new Date(); a = s.createElement(o),m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m) })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); ga('create', 'UA-102991991-1', 'auto'); ga('send', 'pageview');</script>\n\n")

# Scroll to top
f.write("<script>$(document).scroll(function () {var y = $(this).scrollTop();var trigger = 100;if (y >= (trigger)) {$('#topbtn').fadeIn();} else {$('#topbtn').fadeOut();}});</script>\n\n")

# Scripts
f.write('<script>$(document).ready(function () {')
f.write("$('#topbtn').click(function () {jQuery('html,body').animate({scrollTop: 0}, 0);});\n")
f.write("$('.region').click(function () {var region = this.id; $('.' + region).animate({ height: 'toggle'});});\n")
f.write("});</script>\n\n")

f.write('<script src="hikes.js"></script>')

f.write("</head>\n\n")

# Body
f.write("<body>\n")

# Navbar
f.write('<!-- Nav Bar --><nav class="navbar sticky-top navbar-expand-lg shadow-sm"><a class="navbar-brand" href="index.html" style="font-size: 2em;">Lufei</a><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navbarText"><ul class="navbar-nav mr-auto"><li class="nav-item"><a class="nav-link text-center" href="resume.html">Resume</a></li><li class="nav-item"><a class="nav-link text-center" href="project.html">Projects</a></li><li class="nav-item"><a class="nav-link text-center active" href="menu.html">Life</a></li><li class="nav-item"><a class="nav-link text-center" href="lululetter/index.html">lululetter</a></li></ul></div></nav>\n\n')

f.write('<div class="container"><div class="header"><h1>Hike Log</h1></div>\n')

f.write('<div class="controls"><form><div class="form-group"><label for="sorting">Sort by: </label><select id="sorting"><option value="name">Name</option><option value="region">Region</option><option value="difficulty">Difficulty</option><option value="rating">Rating</option><option value="est-year">Year</option></select></div><div class="form-group"><label for="filter">Filter: </label><select id="filter"><option value="all">All</option></select></div><div class="form-group"><input type="checkbox" id="toggle-done"><label for="toggle-done">To Dos</label></div></form></div>')

f.write("<div class='card-columns'>\n")
create_cards(dataset)
f.write("</div>\n")

f.write('<button id="topbtn" style="margin:0 auto;">Back to Top</button>')

# Closing tags
f.write("</div></body>\n")

# Footer
f.write('<footer><div id="page_content"><a href="https://www.facebook.com/lululufei" target="_blank"> <i class="fa fa-facebook-official w3-hover-opacity" style="font-size:24px;"></a></i>&nbsp;&nbsp;&nbsp;<a href="http://instagram.com/lululetter" target="_blank"> <i class="fa fa-instagram w3-hover-opacity"  style="font-size:24px;"></a></i>&nbsp;&nbsp;&nbsp;<a href="http://www.linkedin.com/in/lufei-liu-b8913b106" target="_blank"> <i class="fa fa-linkedin w3-hover-opacity" style="font-size:24px;"></i> </a></br> <p>me@lufei.ca</p></div></footer></html>\n\n')

f.close()
