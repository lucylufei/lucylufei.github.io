function display_gpr_data() {
    gpr_table = '<table class="table table-bordered"><thead><tr><th scope="col">Voltage Potential (V)</th><th scope="col">Radial Distance (m)</th></tr></thead><tbody>';

    for (var i = 0; i < gpr_data.length; i++) {
        gpr_table += "<tr>"
        gpr_table += "<td>" + gpr_data[i].voltage + "</td>";
        gpr_table += "<td>" + gpr_data[i].distance + "</td>";
    }
    gpr_table += "</tbody></table>";

    $("#processed_data").html(gpr_table);
}

function calculate_gpr() {
    if (debug) console.log("Calculating GPR...");
    var data_worst = [];
    var data_best = [];
    var data_avg = [];

    var saved_voltage = $("#voltage").val();

    // Calculate worst case
    $("#voltage").val(gpr_data[0].voltage);
    var p_f_worst = calculate_fibrillation();
    if (debug) console.log("Worst case P_fib (" + gpr_data[0].voltage + "V): " + p_f_worst);
    
    // Calculate best case
    $("#voltage").val(gpr_data[gpr_data.length-1].voltage);
    var p_f_best = calculate_fibrillation();
    if (debug) console.log("Best case P_fib (" + gpr_data[gpr_data.length-1].voltage + "V): " + p_f_best);

    // Calculate average case
    var population = parseFloat($("#gpr_population").val());
    var voltage;
    var distance;
    var p_f_avg = 0;

    if (debug) console.log("Average case P_fib for " + population + " people:");
    for (var i=0; i<population; i++) {
        distance = gpr_data[gpr_data.length-1].distance / population * i;
        voltage = interpolate(gpr_data, distance, keyx="distance", keyy="voltage");
        $("#voltage").val(voltage);
        p_f_avg += calculate_fibrillation();
        if (debug) console.log("Voltage " + i + ": " + voltage + " V");
    }
    p_f_avg = p_f_avg / population;
    if (debug) console.log("Average case P_fib: " + p_f_avg);

    $("#gpr_results").show();

    if (debug) console.log("Generating plots...");
    var coincidence_data = generate_coincidence_data(100);
    for (var i = 0; i < coincidence_data.length; i++) {
        data_worst.push(
            {
                "x": coincidence_data[i].x,
                "y": (coincidence_data[i].y * p_f_worst).toExponential(3)
            }        
        );
        data_best.push(
            {
                "x": coincidence_data[i].x,
                "y": (coincidence_data[i].y * p_f_best).toExponential(3)
            }        
        );
        data_avg.push(
            {
                "x": coincidence_data[i].x,
                "y": (coincidence_data[i].y * p_f_avg).toExponential(3)
            }        
        );
    }

    plot_gpr(data_avg, data_best, data_worst);

    // Reset voltage
    $("#voltage").val(saved_voltage);
}

function plot_gpr(data_avg, data_best, data_worst) {
    var ctx_avg = $("#gprAverageChart");

    if (gpr_avg_chart) gpr_avg_chart.destroy();
    gpr_avg_chart = new Chart(ctx_avg, {
        type: "scatter",
        data: {
            datasets: [{
                label: "P_Fatality",
                borderColor: "#004F6C",
                data: data_avg,
                showLine: true,
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                text: 'GPR Fatality Curve'
            },
            legend: {
                display: false,
                position: 'bottom'
            },
            scales: {
                yAxes: [{
                    type: "logarithmic",
                    scaleLabel: {
                        display: true,
                        labelString: "Probability of Fatality",
                        fontSize: 18
                    },
                    ticks: {
                        min: 1e-10
                    }
                }],
                xAxes: [{
                    type: "linear",
                    scaleLabel: {
                        display: true,
                        labelString: "At least N fatalities",
                        fontSize: 18
                    }
                }]
            }
        }
    });

    var ctx_best = $("#gprBestChart");

    if (gpr_best_chart) gpr_best_chart.destroy();
    gpr_best_chart = new Chart(ctx_best, {
        type: "scatter",
        data: {
            datasets: [{
                label: "P_Fatality",
                borderColor: "#004F6C",
                data: data_best,
                showLine: true,
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                text: 'GPR Fatality Curve'
            },
            legend: {
                display: false,
                position: 'bottom'
            },
            scales: {
                yAxes: [{
                    type: "logarithmic",
                    scaleLabel: {
                        display: true,
                        labelString: "Probability of Fatality",
                        fontSize: 18
                    },
                    ticks: {
                        min: 1e-10
                    }
                }],
                xAxes: [{
                    type: "linear",
                    scaleLabel: {
                        display: true,
                        labelString: "At least N fatalities",
                        fontSize: 18
                    }
                }]
            }
        }
    });

    var ctx_worst = $("#gprWorstChart");

    if (gpr_worst_chart) gpr_worst_chart.destroy();
    gpr_worst_chart = new Chart(ctx_worst, {
        type: "scatter",
        data: {
            datasets: [{
                label: "P_Fatality",
                borderColor: "#004F6C",
                data: data_worst,
                showLine: true,
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                text: 'GPR Fatality Curve'
            },
            legend: {
                display: false,
                position: 'bottom'
            },
            scales: {
                yAxes: [{
                    type: "logarithmic",
                    scaleLabel: {
                        display: true,
                        labelString: "Probability of Fatality",
                        fontSize: 18
                    },
                    ticks: {
                        min: 1e-10
                    }
                }],
                xAxes: [{
                    type: "linear",
                    scaleLabel: {
                        display: true,
                        labelString: "At least N fatalities",
                        fontSize: 18
                    }
                }]
            }
        }
    });

    // Add thresholds
    add_threshold_data(gpr_avg_chart, 1);
    add_threshold_data(gpr_best_chart, 1);
    add_threshold_data(gpr_worst_chart, 1);
}

$(document).ready(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    $("#gpr_help").prop("title", gpr_helptext);

    $("#gpr").click(function () {
        if (!gpr_data_valid) {
            $("#gpr_button").addClass("disabled");
            $("#processed_data").html("No processed data.")
        } else $("#gpr_button").removeClass("disabled");
    });

    $("#gpr_process_button").click(function () {
        gpr_data = [];
        gpr_data_valid = false;
        $("#gpr_button").addClass("disabled");

        if (debug) console.log("Processing GPR data...");
        if (debug) console.log($("#gpr_data").val());

        var data = $("#gpr_data").val();
        var lines = data.split("\n");

        for (var i = 0; i < lines.length; i++) {
            var dataset = lines[i].split("\t");
            if (dataset.length <= 2) {
                if (dataset[0] != "" && dataset[1] != "" && !isNaN(dataset[0]) && !isNaN(dataset[1]))
                    gpr_data.push({
                        "voltage": parseInt(dataset[0]),
                        "distance": parseInt(dataset[1])
                    });
            } else {
                alert("Invalid GPR format used. Please refer to user guide for more information.");
                return;
            }
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

    $("#cancel_gpr").click(function () {
        gpr_data = [];
        gpr_data_valid = false;
        
        // $("#voltage").removeAttr("disabled");
    });
    
    // $("#gpr_button").click(function () {
    //     if (gpr_data_valid && $("#analysis_type").val() == "societal") {
    //         $("#voltage").attr("disabled", "disabled");
    //         $("#voltage").prop("title", "Using GPR settings");
    //         $("#voltage").prop("data-toggle", "tooltip");
    //     }
    //     else $("#voltage").removeAttr("disabled");
    // })

    $("#gpr_clear_button").click(function () {
        $("#gpr_data").val("");
    });
});