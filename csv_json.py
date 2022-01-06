import csv

path = r"/Users/lufei/Documents/GitHub/lucylufei.github.io/projectscsv.csv"
path_json = r"/Users/lufei/Documents/GitHub/lucylufei.github.io/project.json"

csvfile = open(path, newline='') 
	
projects = csv.reader(csvfile, delimiter=',')

keys = []
project_array = []

for row in projects:
	project_array.append(row)

for key in project_array[0]:
	keys.append(key)

print(keys)


jsonfile = open(path_json, "w+")

jsonfile.write("{\"projects\":[")

for project in range(1, len(project_array)):
	jsonfile.write("{\n")
	for i, key in enumerate(keys):
		jsonfile.write("\"{key}\":".format(key=key))
		if "tags" in key or "skills" in key:
			jsonfile.write("[\"{data}\"]".format(data=project_array[project][i].replace(",", "\",\"")))
		elif "id" in key:
			jsonfile.write("{data}".format(data=project_array[project][i]))
		else:
			data = project_array[project][i].replace("\"", "\\\"")
			jsonfile.write("\"{data}\"".format(data=data))
		if i is not len(keys)-1:
			jsonfile.write(",\n")
	jsonfile.write("}")
	if project is not len(project_array)-1:
		jsonfile.write(",\n")

jsonfile.write("]}")
jsonfile.close()
