import os

f = open("archive.html", "w")

f.write("<html><body><h3>")

f.write("PhD Log Files")
f.write("</h3>")

for item in os.listdir("archive/phd-log"):
    if ".html" in item:
        f.write('<a href="archive/phd-log/{link}">{name}</a></br>'.format(
            link=item,
            name=item[:item.find(".")]
        ))
    
f.write("<hr>")
f.write("<h3>Archived Files</h3>")
for item in os.listdir("archive"):
    if "." in item:
        f.write('<a href="archive/{link}">{name}</a></br>'.format(
            link=item,
            name=item[:item.find(".")]
        ))
    
f.write("</h3></body></html>")
f.close()
