f = open("hikes.csv", "r")

ordered_regions = [
    "Lower Mainland",
    "Fraser Valley",
    "Sea to Sky",
    "Rockies",
]

dataset = {}
regions = set()
for line in f.readlines()[1:]:
    content = line.strip().split(",")
    dataset[content[2]] = {
        "done" : content[0],
        "region" : content[1],
        "rating" : content[3],
        "rec" : content[4],
        "comment" : ", ".join(content[5:]).replace('"', '')
    }
    regions.add(content[1])

f.close()


f = open("../hikelog.html", "w+")

# Header
f.write('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Hike Log &#9829;</title>\n\n')

# Analytics
f.write("<script async src='https://www.googletagmanager.com/gtag/js?id=UA-102991991-2'></script><script>window.dataLayer = window.dataLayer || [];function gtag() {dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-102991991-2'); </script>\n\n")

# Files
f.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,300;0,400;0,600;0,700;1,400&display=swap" rel="stylesheet"><link rel="icon" href="./images/L.png"><link rel="stylesheet" href="common.css"><link rel="stylesheet" href="lululetter.css"><link rel="stylesheet" href="topbutton.css"><script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>\n\n')

# Analytics
f.write("<script>(function (i, s, o, g, r, a, m) {i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {(i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1 * new Date(); a = s.createElement(o),m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m) })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); ga('create', 'UA-102991991-1', 'auto'); ga('send', 'pageview');</script>\n\n")

# Scroll to top
f.write("<script>$(document).scroll(function () {var y = $(this).scrollTop();var trigger = 100;if (y >= (trigger)) {$('#topbtn').fadeIn();} else {$('#topbtn').fadeOut();}});</script>\n\n")

# Scripts
f.write('<script>$(document).ready(function () {')
f.write("$('#topbtn').click(function () {jQuery('html,body').animate({scrollTop: 0}, 0);});\n")
f.write("$('.region').click(function () {var region = this.id; $('.' + region).animate({ height: 'toggle'});});\n")
f.write("});</script>\n\n")

f.write("</head>\n\n")

# Body
f.write("<body>\n")

# Navbar
f.write('<!-- Nav Bar --><nav class="navbar sticky-top navbar-expand-lg shadow-sm"><a class="navbar-brand" href="index.html" style="font-size: 2em;">Lufei</a><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navbarText"><ul class="navbar-nav mr-auto"><li class="nav-item"><a class="nav-link text-center" href="resume.html">Resume</a></li><li class="nav-item"><a class="nav-link text-center" href="project.html">Projects</a></li><li class="nav-item"><a class="nav-link text-center active" href="menu.html">Life</a></li><li class="nav-item"><a class="nav-link text-center" href="lululetter.html">lululetter</a></li></ul></div></nav>\n\n')

f.write('<div class="container"><div class="header"><h1>Hike Log</h1></div>\n')

f.write('<div class="faded" style="text-align: center;"><a href="https://www.instagram.com/propinquity.effect/" target="_blank">Questions? Ask <span class="special-link">@propinquity.effect</span></a></div><br>\n')

for region in ordered_regions:
    region_class = region.replace(" ", "-").replace("(", "").replace(")", "").lower()
    f.write('<div class="card region" id="{c}"><div class="card-header"><table><tr><th style="text-align: left; width: 100vw;">{r}</th><th style="text-align: right;"><i class="fa fa-sort-down"></i></th></tr></table></div></div></br>\n'.format(r=region, c=region_class))
    f.write('<div class="card-columns">\n')
    for hike in dataset:
        if dataset[hike]["region"] == region:
            f.write('<div class="card {}">'.format(region_class))
            if dataset[hike]["done"] == "Yes":
                f.write('<img src="./images/hikes/{img}.JPG" class="card-img-top" alt="...">'.format(img=hike.replace(" ", "-").replace("'", "").lower()))
                num_stars = int(dataset[hike]["rec"]) - 2
                star_rating = ' <i class="fa fa-heart" aria-hidden="true"></i>' * num_stars
                star_rating += ' <i class="fa fa-heart-o" aria-hidden="true"></i>' * (3 - num_stars)
                f.write('<div class="card-body"><h5 class="card-title">{name}</h5><p class="card-text">{rating}</br>{rec}<hr>{comment}</p></div></div>\n'.format(name=hike, rating=dataset[hike]["rating"], rec=star_rating, comment=dataset[hike]["comment"]))
            else:
                f.write('<div class="card-body"><h5 class="card-title" style="color: gray;">{name}</h5></div></div>\n'.format(name=hike, rating=dataset[hike]["rating"]))

    f.write("</div>")
    regions.remove(region)

for region in regions:
    region_class = region.replace(" ", "-").replace("(", "").replace(")", "").lower()
    f.write('<div class="card region" id="{c}"><div class="card-header"><table><tr><th style="text-align: left; width: 100vw;">{r}</th><th style="text-align: right;"><i class="fa fa-sort-down"></i></th></tr></table></div></div></br>\n'.format(r=region, c=region_class))
    f.write('<div class="card-columns">\n')
    for hike in dataset:
        if dataset[hike]["region"] == region:
            f.write('<div class="card {}">'.format(region_class))
            if dataset[hike]["done"] == "Yes":
                f.write('<img src="./images/hikes/{img}.JPG" class="card-img-top" alt="...">'.format(img=hike.replace(" ", "-").lower()))
                num_stars = int(dataset[hike]["rec"]) - 2
                star_rating = ' <i class="fa fa-heart" aria-hidden="true"></i>' * num_stars
                star_rating += ' <i class="fa fa-heart-o" aria-hidden="true"></i>' * (3 - num_stars)
                f.write('<div class="card-body"><h5 class="card-title">{name}</h5><p class="card-text">{rating}</br>{rec}<hr>{comment}</p></div></div>\n'.format(name=hike, rating=dataset[hike]["rating"], rec=star_rating, comment=dataset[hike]["comment"]))
            else:
                f.write('<div class="card-body"><h5 class="card-title" style="color: gray;">{name}</h5></div></div>\n'.format(name=hike, rating=dataset[hike]["rating"]))

    f.write("</div>")

f.write('<button id="topbtn" style="margin:0 auto;">Back to Top</button>')

# Closing tags
f.write("</div></body>\n")

# Footer
f.write('<footer><div id="page_content"><a href="https://www.facebook.com/lululufei" target="_blank"> <i class="fa fa-facebook-official w3-hover-opacity" style="font-size:24px;"></a></i>&nbsp;&nbsp;&nbsp;<a href="http://instagram.com/lululetter" target="_blank"> <i class="fa fa-instagram w3-hover-opacity"  style="font-size:24px;"></a></i>&nbsp;&nbsp;&nbsp;<a href="http://www.linkedin.com/in/lufei-liu-b8913b106" target="_blank"> <i class="fa fa-linkedin w3-hover-opacity" style="font-size:24px;"></i> </a></br> <p>me@lufei.ca</p></div></footer></html>\n\n')

f.close()
