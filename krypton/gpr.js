
function display_gpr_data () {
    gpr_table = '<table class="table table-bordered"><thead><tr><th scope="col">Applied Voltage</th><th scope="col">Radial Distance</th></tr></thead><tbody>';

    for (var i=0; i<gpr_data.length; i++) {
        gpr_table += "<tr>"
        gpr_table += "<td>" + gpr_data[i].voltage + "</td>";
        gpr_table += "<td>" + gpr_data[i].distance + "</td>";
    }
    gpr_table += "</tbody></table>";

    $("#processed_data").html(gpr_table);
}


$(document).ready(function () {
    $("#gpr").click( function() {
        if (!gpr_data_valid) {
            $("#gpr_button").addClass("disabled");
            $("#processed_data").html("No processed data.")
        }
        else $("#gpr_button").removeClass("disabled"); 
    });

    $("#gpr_process_button").click( function() {
        gpr_data = [];
        gpr_data_valid = false;
        $("#gpr_button").addClass("disabled");

        if (debug) console.log("Processing GPR data...");
        if (debug) console.log($("#gpr_data").val());

        var data = $("#gpr_data").val();
        var lines = data.split("\n");
        
        for (var i=0; i<lines.length; i++) {
            var dataset = lines[i].split("\t");
            if (dataset.length <= 2) {
                if (dataset[0] != "" && dataset[1] != "")
                    gpr_data.push({"voltage": dataset[0], "distance": dataset[1]});
            }
            else alert("Invalid GPR format used. Please refer to user guide for more information.");
        }
        
        if (gpr_data.length == 0) alert("No GPR data was recorded. Please refer to user guide for more information.");
        
        // Process is successful 
        else {
            gpr_data.sort(function (a, b) {
                return a.distance - b.distance;
            });
            $("#gpr_button").removeClass("disabled");
            gpr_data_valid = true;
            display_gpr_data();
        }
    });
    $("#cancel_gpr").click( function() {
        gpr_data = [];
        gpr_data_valid = false;
    });
});
