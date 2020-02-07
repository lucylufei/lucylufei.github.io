console.log("js added");

/*----- GLOBAL PARAMETERS -----*/
var debug = true;

// Log Normal Standard Deviation
var sd = 0.3;

// Global chart variable
var coincidence_chart;

// Circuit Breaker Data
var breaker_data = {
    "bulk_oil": {
        "69": 0.01,
        "138": 0.01,
        "230": 0.01,
        "500": 0.01
    },
    "dead_tank": {
        "69": 0.01,
        "138": 0.01,
        "230": 0.01,
        "500": 0.01
    },
    "air_blast": {
        "69": 0.01,
        "138": 0.01,
        "230": 0.01,
        "500": 0.01
    }
}

/* Normal CDF function from https://www.math.ucla.edu/~tom/distributions/normal.html? */
function cdfNormal(value, mean = 0, standardDeviation = 1) {
    var X = (value - mean) / standardDeviation;
    var T = 1 / (1 + .2316419 * Math.abs(X));
    var D = .3989423 * Math.exp(-X * X / 2);
    var Prob = D * T * (.3193815 + T * (-.3565638 + T * (1.781478 + T * (-1.821256 + T * 1.330274))));
    if (X > 0) {
        Prob = 1 - Prob
    }
    return Prob;
}

function cdfLogNormal(value, mean, standardDeviation) {
    return cdfNormal((Math.log(value) - mean) / standardDeviation);
}

function factorial(n) {
    var fact = 1;

    for (var i = 2; i <= n; i++) {
        fact = fact * i;
    }

    return fact;
}

function n_choose_k(n, k) {
    return factorial(n) / (factorial(k) * factorial(n - k));
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {
        type: contentType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function check_inputs_coincidence() {

    if ($("#analysis_type").val() === "") {
        return false;
    } else if ($("#analysis_type").val() == "individual") {
        if ($("#fault_rate").val() === "") return false;
        if ($("#fault_time").val() === "") return false;
        if ($("#contact_rate").val() === "") return false;
        if ($("#contact_time").val() === "") return false;

        return true;
    } else if ($("#analysis_type").val() == "societal") {
        if ($("#fault_rate").val() === "") return false;
        if ($("#fault_time").val() === "") return false;
        if ($("#gathering_rate").val() === "") return false;
        if ($("#gathering_time").val() === "") return false;
        if ($("#population").val() === "") return false;

        return true;
    }

    return false;
}

function calculate_group_coincidence(n, prob, population, fault_rate) {
    p_c = 0;
    for (var i = n; i <= population; i++) {
        p_c = p_c + 1 - Math.pow((1 - (n_choose_k(population, i) * Math.pow(prob, i) * Math.pow((1 - prob), (population - i)))), fault_rate);
    }
    return p_c;
}

function calculate_coincidence() {
    var p_c = NaN;
    var fault_rate = parseFloat($("#fault_rate").val());
    var fault_time = parseFloat($("#fault_time").val());

    if (check_inputs_coincidence()) {
        console.log("Calculating probability of coincidence...");

        if ($("#analysis_type").val() == "individual") {
            var contact_rate = parseFloat($("#contact_rate").val());
            var contact_time = parseFloat($("#contact_time").val());

            p_c = (fault_rate * contact_rate * (fault_time + contact_time)) / (365 * 24 * 60 * 60);
        } else {
            var population = parseFloat($("#population").val());
            var gathering_rate = parseFloat($("#gathering_rate").val());
            var gathering_time = parseFloat($("#gathering_time").val()) * 60 * 60;

            var prob;
            prob = (fault_time + gathering_time - (Math.pow(fault_time, 2) + Math.pow(gathering_time, 2) / (2 * (365 * 24 * 60 * 60)))) / (365 * 24 * 60 * 60);
            prob = 1 - Math.pow((1 - prob), gathering_rate);
            if (debug) console.log("P_C: " + prob)

            p_c = calculate_group_coincidence(1, prob, population, fault_rate);
            if (debug) console.log("EV: " + p_c)

            display_coincidence();
        }

        if (p_c > 1) p_c = 1;
        $("#PC").html(p_c.toExponential(3));
    }
    return p_c;
}

function generate_coincidence_data(max) {
    var data = [];

    var fault_rate = parseFloat($("#fault_rate").val());
    var fault_time = parseFloat($("#fault_time").val());
    var population = parseFloat($("#population").val());
    var gathering_rate = parseFloat($("#gathering_rate").val());
    var gathering_time = parseFloat($("#gathering_time").val()) * 60 * 60;

    var prob;
    prob = (fault_time + gathering_time - (Math.pow(fault_time, 2) + Math.pow(gathering_time, 2) / (2 * (365 * 24 * 60 * 60)))) / (365 * 24 * 60 * 60);
    prob = 1 - Math.pow((1 - prob), gathering_rate);

    p_c = 1;
    n = 1;
    while (p_c > 1e-10 && n < max) {
        p_c = calculate_group_coincidence(n, prob, population, fault_rate);
        data.push({
            x: n,
            y: p_c
        });
        n = n + 1;
    }

    return data;
}


function check_inputs_fibrillation() {

    if ($("#shock_path").val() === "") return false;
    if ($("#voltage").val() === "") return false;
    if ($("#soil_resistivity").val() === "") return false;
    if ($("#surface_depth").val() === "") return false;
    if ($("#surface_depth").val() != "0" && $("#surface_resistivity").val() === "") return false;
    if ($("#fault_time").val() === "") return false;

    return true;

}

function define_mean(fault_time) {
    return fault_time;
}

function calculate_body_resistance(conditions, voltage, shock_path) {
    // 0.5,MAX(SWITCH(D13,
    //     "Dry",MIN(11885*D6^(-0.416),3250),
    //     "Wet",MIN(-433.2*LN(D6)+3616.6,2175),
    //     "Salt Wet",MIN(0.0007*D6^2-1.3068*D6+1350.3),1300),775)
    var min_r, max_r;
    var resistance;

    min_r = 775;
    if (conditions == "dry") {
        max_r = 3250;
        resistance = 11885 * Math.pow(voltage, -0.416);
    } else if (conditions == "wet") {
        max_r = 2175;
        resistance = -433.2 * Math.log(voltage) + 3616.6;
    } else if (conditions == "salt") {
        max_r = 1300;
        resistance = 0.0007 * Math.pow(voltage, 2) - 1.3068 * voltage + 1350.3;
    }

    if (resistance > max_r) resistance = max_r;
    else if (resistance < min_r) resistance = min_r;

    if (debug) console.log("Body resistance (raw): " + resistance);

    if (shock_path == "step") return resistance * 0.275;
    else if (shock_path == "touch") return resistance * 0.75;
}

function calculate_ground_resistance(soil_resistivity, surface_depth, surface_resistivity) {
    var derating_factor;
    var ground_resistance;

    if (surface_depth == 0) {
        derating_factor = 1;
    } else {
        derating_factor = 1 - ((0.09 * (1 - (soil_resistivity / surface_resistivity))) / ((2 * surface_depth) + 0.09));
    }

    ground_resistance = soil_resistivity / (4 * 0.08) * derating_factor;

    return ground_resistance;
}

function calculate_fibrillation() {
    var p_f = NaN;

    var shock_path = $("#shock_path").val();
    var voltage = parseFloat($("#voltage").val());
    var soil_resistivity = parseFloat($("#soil_resistivity").val());
    var surface_depth = parseFloat($("#surface_depth").val());
    var surface_resistivity = parseFloat($("#surface_resistivity").val());
    var surface_conditions = $("#surface_conditions").val();
    var shoe_type = $("#shoe_type").val();
    var fault_time = parseFloat($("#fault_time").val());

    var shoe_resistance;
    switch (shoe_type) {
        case "foot":
            shoe_resistance = 0;
            break;
    }


    if (check_inputs_fibrillation()) {
        console.log("Calculating probability of fibrillation...");

        var body_resistance = calculate_body_resistance(surface_conditions, voltage, shock_path);
        var ground_resistance = calculate_ground_resistance(soil_resistivity, surface_depth, surface_resistivity);

        if (debug) console.log("Body resistance (processed): " + body_resistance);
        if (debug) console.log("Ground resistance: " + ground_resistance);

        var total_resistace;
        if (shock_path == "touch") total_resistace = body_resistance + (ground_resistance + shoe_resistance) / 2;
        else if (shock_path == "step") total_resistace = body_resistance + (ground_resistance + shoe_resistance) * 2;

        if (debug) console.log("Total resistance: " + total_resistace);

        var current = voltage / total_resistace;
        if (debug) console.log("Body current (raw): " + current);

        var mean = define_mean(fault_time);
        if (debug) console.log("Lognormal mean: " + mean);

        p_f = cdfLogNormal(current, mean, sd);

        $("#PF").html(p_f.toExponential(3));
        display_chart(mean);

        add_threshold_data(coincidence_chart, p_f);
    }
    return p_f;
}

function define_risk(p_dead) {
    var safe_thresh = parseFloat($("#low_threshold").val());
    var warn_thresh = parseFloat($("#high_threshold").val());

    $(".bg-success").html("");
    $(".bg-warning").html("");
    $(".bg-danger").html("");
    if (p_dead == 0) {
        $(".bg-success").html("Acceptable Risk - Manager Level");
        $(".bg-success").width("100%");
        $(".bg-warning").width("0%");
        $(".bg-danger").width("0%");
    } else if (p_dead < safe_thresh) {
        $(".bg-success").html("Manager Level");
        $(".bg-success").width(Math.log10(safe_thresh) / Math.log10(p_dead) * 45 + "%");
        $(".bg-warning").width("0%");
        $(".bg-danger").width("0%");
    } else if (p_dead < warn_thresh) {
        $(".bg-success").html("Manager Level");
        $(".bg-warning").html("Senior Manager Level");
        $(".bg-success").width("45%");
        $(".bg-warning").width(Math.log10(warn_thresh) / Math.log10(p_dead) * 30 + "%");
        $(".bg-danger").width("0%");
    } else {
        $(".bg-success").html("Manager Level");
        $(".bg-warning").html("Senior Manager Level");
        $(".bg-danger").html("Executive Level");
        $(".bg-success").width("45%");
        $(".bg-warning").width("30%");
        $(".bg-danger").width(p_dead * 20 + "%");
    }
}

function generate_data(mean) {
    var data = [];
    var current;
    for (var i = 0; i < 10; i++) {
        current = i * 1 / 10;
        data.push({
            x: current,
            y: cdfLogNormal(current, mean, sd)
        });
    }

    if (debug) console.log("Generating data...");
    if (debug) console.log(data);
    return data;
}

function display_coincidence() {
    var ctx = $("#coincidenceChart");

    data = generate_coincidence_data(100);

    coincidence_chart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [{
                label: "P_Coincidence",
                borderColor: "#004F6C",
                data: data,
                showLine: true,
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                text: 'Coincidence Curve'
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
                        labelString: "Probability of Coincidence",
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
                        labelString: "Affected People",
                        fontSize: 18
                    }
                }]
            }
        }
    });

}

function add_threshold_data(chart, p_f) {
    var threshold;

    var safe_data = [];
    for (var i = 1; i < 10; i++) {
        threshold = 1e-6 / p_f;
        safe_data.push({
            x: i,
            y: threshold
        });
    }
    var warning_data = [];
    for (var i = 1; i < 10; i++) {
        threshold = 1e-5 / p_f;
        warning_data.push({
            x: i,
            y: threshold
        });
    }
    chart.data.datasets.push({
        label: "Manager Threshold",
        borderColor: "rgba(4,106,56,0.5)",
        backgroundColor: "rgba(188,209,155,0.5)",
        data: safe_data,
        showLine: true,
        fill: true
    });
    chart.data.datasets.push({
        label: "Executive Threshold",
        borderColor: "rgba(250,70,22,0.5)",
        data: warning_data,
        showLine: true,
        fill: false
    });


    chart.update();
}

function display_chart(mean) {

    var ctx = $("#resultChart");

    data = generate_data(mean);

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Test Line',
                borderColor: "#004F6C",
                data: data,
                showLine: true,
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                text: 'Fibrillation Curve'
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
                        labelString: "Probability of Fibrillation",
                        fontSize: 18
                    },
                    ticks: {
                        max: 0.7
                    }
                }],
                xAxes: [{
                    type: "linear",
                    scaleLabel: {
                        display: true,
                        labelString: "Current (A)",
                        fontSize: 18
                    }
                }]
            }
        },
    });
}

function calculate_fatality(p_c, p_f) {
    var p_dead = p_c * p_f;

    if ($("#breaker_toggle").prop("checked")) {
        if (debug) console.log("Including breaker data in calculation...");

        var breaker_type = $("#breaker_type").val();
        var transmission_v = $("#voltage_type").val();

        if (debug) console.log("Breaker Type: " + breaker_type);
        if (debug) console.log("Transmission Voltage: " + transmission_v);

        var breaker_failure = breaker_data[breaker_type][transmission_v];
        if (debug) console.log("Breaker failure rate: " + breaker_failure);

        if (debug) console.log("P_fatality original: " + p_dead);
        var p_dead1 = p_dead * (1 - breaker_failure);

        var new_fault_time = $("#fault_time").val(parseFloat($("#fault_time").val()) + 0.1);
        if (debug) console.log("Calculating P_fatality for " + new_fault_time);

        p_c = calculate_coincidence();
        p_f = calculate_fibrillation();
        p_dead2 = p_c * p_f;

        if (debug) console.log("P_fatality new: " + p_dead2);

        p_dead2 = p_dead2 * breaker_failure;
        p_dead = p_dead1 + p_dead2;

        if (!debug) $("#fault_time").val(parseFloat($("#fault_time").val()) - 0.1);
    }

    console.log("Calculating probability of fatality...");
    if (!(isNaN(p_dead))) {
        if (p_dead > 1) p_dead = 1;
        $("#PDead").html(p_dead.toExponential(3));
        define_risk(p_dead);
        location.href = "#results";
    } else {
        if (!debug) alert("Please ensure all necessary inputs are entered.");
        if (debug) console.log("Please ensure all necessary inputs are entered.");
    }
}

$(document).ready(function () {

    var template = document.getElementById('templateForm');
    if (debug) console.log("Template: " + template);
    document.getElementById('templateForm').addEventListener('submit', function (e) {
        //prevent the normal submission of the form
        e.preventDefault();

        var content = $("#templateForm").serializeArray();

        for (var i = 0; i < content.length; i = i + 1) {
            if (content[i].value === "") {
                if (!debug) alert("Please fill in all fields")
                return;
            }
        }
        var jsonData = JSON.stringify(content);
        var file_name = $("#templateName").val();

        download(jsonData, file_name + '_template.json', 'application/json');
        jQuery('#templateModal').modal('hide');
        $("form").trigger("reset");
    });


    // ------------- CALCULATE --------------//
    $("#calculate").click(function () {
        console.log("Calculating...");
        var p_c = calculate_coincidence();
        var p_f = calculate_fibrillation();

        calculate_fatality(p_c, p_f);
    });
    $(".input-group").keyup(function (e) {
        // Check for enter key
        if (e.which == 13) {
            console.log("Calculating...");
            var p_c = calculate_coincidence();
            var p_f = calculate_fibrillation();

            calculate_fatality(p_c, p_f);
        }
    });
    // ----------------------------------//

    // ------------- MODALS --------------//
    $(".fa-repeat").click(function () {
        location.reload();
        location.href = "#";
    });

    $(".fa-cog").click(function () {
        $('#settingsModal').modal('show');
    });

    $(".fa-question-circle").click(function () {
        $('#helpModal').modal('show');
    });

    $("#manual_button").click(function () {
        console.log("Opening manual...")
        window.open("readme.html", "_blank");
    });
    // ----------------------------------//

    // ------------- FORM CONTROLS --------------//
    $(".hidden").hide();

    $('#analysis_type').change(function () {
        if (debug) console.log("Analysis type: " + this.value);
        var type = this.value;

        if (type == "individual") {
            $(".societal").hide();
            $(".individual").show();
        } else {
            $(".individual").hide();
            $(".societal").show();
        }
    });

    $("#surface_depth").change(function () {
        if (this.value == "0") $("#surface_resistivity").attr("disabled", "disabled");
        else $("#surface_resistivity").removeAttr("disabled");
    });

    $("#breaker_toggle").change(function () {
        if (this.checked === true) $(".breaker").show();
        else $(".breaker").hide();
    });

    $(".scientific").change(function () {
        if (this.value === "") alert("Please set a threshold!");
        this.value = Number(this.value).toExponential(2);
    });
    // ----------------------------------//
});