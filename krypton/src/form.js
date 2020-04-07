console.log("js added");

// FUNCTION:
// Checks that all inputs necessary to calculate probability of coincidence have been properly entered. 
// Dependencies: None
function check_inputs_coincidence() {

    if ($("#analysis_type").val() === "") {
        return false;
    }

    // Check "individual" fields
    else if ($("#analysis_type").val() == "individual") {
        if ($("#fault_rate").val() === "") return false;
        if ($("#fault_time").val() === "") return false;
        if ($("#contact_rate").val() === "") return false;
        if ($("#contact_time").val() === "") return false;
        if (parseFloat($("#fault_rate").val()) <= 0) return false;
        if (parseFloat($("#fault_time").val()) <= 0) return false;
        if (parseFloat($("#contact_rate").val()) <= 0) return false;
        if (parseFloat($("#contact_time").val()) <= 0) return false;

        return true;
    }

    // Check "societal" fields
    else if ($("#analysis_type").val() == "societal") {
        if ($("#fault_rate").val() === "") return false;
        if ($("#fault_time").val() === "") return false;
        if ($("#gathering_rate").val() === "") return false;
        if ($("#gathering_time").val() === "") return false;
        if ($("#population").val() === "") return false;
        if (parseFloat($("#fault_rate").val()) <= 0) return false;
        if (parseFloat($("#fault_time").val()) <= 0) return false;
        if (parseFloat($("#gathering_rate").val()) <= 0) return false;
        if (parseFloat($("#gathering_time").val()) <= 0) return false;
        if (parseFloat($("#population").val()) <= 0) return false;

        return true;
    }

    return false;
}


// FUNCTION:
// Calculates probability of coincidence for a societal scenario
// Dependencies: 
//      n_choose_k
function calculate_group_coincidence(n, prob, population, fault_rate) {
    p_c_prev = 0;

    // Sum from at least n affected to total population
    for (var i = n; i <= population; i++) {
        p_c = p_c_prev + 1 - Math.pow((1 - (n_choose_k(population, i) * Math.pow(prob, i) * Math.pow((1 - prob), (population - i)))), fault_rate);
        if (p_c == p_c_prev) break;
        p_c_prev = p_c;
    }
    return p_c;
}


// FUNCTION:
// Calculates probability of coincidence
// Dependencies:
//      check_inputs_coincidence
//      calculate_group_coincidence
//      display_coincidence
function calculate_coincidence() {
    var p_c = NaN;
    var fault_rate = parseFloat($("#fault_rate").val());
    var fault_time = parseFloat($("#fault_time").val());

    // Calculate only if all inputs have been entered
    if (check_inputs_coincidence()) {
        console.log("Calculating probability of coincidence...");

        // INDIVIDUAL
        if ($("#analysis_type").val() == "individual") {
            var contact_rate = parseFloat($("#contact_rate").val());
            var contact_time = parseFloat($("#contact_time").val());

            p_c = (fault_rate * contact_rate * (fault_time + contact_time)) / (365 * 24 * 60 * 60);

            $("#PDeadLabel").html("Probability of Fatality");
        }

        // SOCIETAL
        else {
            var population = parseFloat($("#population").val());
            var gathering_rate = parseFloat($("#gathering_rate").val());
            var gathering_time = parseFloat($("#gathering_time").val());

            // Calculate P_C part one
            var prob;
            prob = (fault_time + gathering_time - ((Math.pow(fault_time, 2) + Math.pow(gathering_time, 2)) / (2 * (365 * 24 * 60 * 60)))) / (365 * 24 * 60 * 60);
            if (debug) console.log("P_C: " + prob.toExponential(3))
            prob = 1 - Math.pow((1 - prob), gathering_rate);
            if (debug) console.log("P_Cmulti: " + prob.toExponential(3))

            // Calculate summation for EV
            p_c = calculate_group_coincidence(1, prob, population, fault_rate);
            if (debug) console.log("EV: " + p_c)

            // Display coincidence graph
            display_coincidence();

            $("#PDeadLabel").html("Probability of At Least 1 Fatality")
        }

        // Cap probability to maximum 100%
        if (p_c > 1) p_c = 1;

        // Update P_C field in form
        $("#PC").html(p_c.toExponential(3));
    }
    return p_c;
}


// FUNCTION:
// Generate data required for probability of coincidence chart in the societal case
// Dependencies:
//      calculate_group_coincidence
// Parameters:
//      max -> the maximum iterations to run, stops even if it does not meet low threshold
function generate_coincidence_data(max) {
    data = [];

    var fault_rate = parseFloat($("#fault_rate").val());
    var fault_time = parseFloat($("#fault_time").val());
    var population = parseFloat($("#population").val());
    var gathering_rate = parseFloat($("#gathering_rate").val());
    var gathering_time = parseFloat($("#gathering_time").val());

    // Calculate P_C part one
    var prob;
    prob = (fault_time + gathering_time - ((Math.pow(fault_time, 2) + Math.pow(gathering_time, 2)) / (2 * (365 * 24 * 60 * 60)))) / (365 * 24 * 60 * 60);
    prob = 1 - Math.pow((1 - prob), gathering_rate);

    // Calculate summation for EV until threshold or max reached
    p_c = 1;
    n = 1;
    while (p_c > p_c_threshold && n < max) {
        p_c = calculate_group_coincidence(n, prob, population, fault_rate);

        if (debug) console.log("Group P_Coincidence (" + n + "): " + p_c);
        data.push({
            x: n,
            y: (p_c).toExponential(3)
        });
        n = n + 1;
    }
    return data;
}


// FUNCTION:
// Check that all inputs for probability of fibrillation have been properly entered. 
// Dependences: None
function check_inputs_fibrillation() {

    if ($("#shock_path").val() === "") return false;
    if ($("#voltage").val() === "") return false;
    if ($("#soil_resistivity").val() === "") return false;
    if ($("#surface_depth").val() === "") return false;
    if ($("#surface_depth").val() != "0" && $("#surface_resistivity").val() === "") return false;
    if ($("#fault_time").val() === "") return false;
    if ($("#shock_path").val() == "touch" && $("#contact_resistance").val() === "") return false;
    if (parseFloat($("#fault_time").val()) <= 0) return false;

    return true;

}


// FUNCTION:
// Defines the mean value applied to the probability of fibrillation log normal distribution
// Dependences: None
function define_mean(fault_time) {
    return interpolate(mu_points, fault_time);
}


// FUNCTION:
// Defines the sigma value applied to the probability of fibrillation log normal distribution
// Dependences: None
function define_sd(fault_time) {
    // var sigma;
    // sigma = -58 * Math.pow(fault_time, 6);
    // sigma += 184.91 * Math.pow(fault_time, 5);
    // sigma += -221.4 * Math.pow(fault_time, 4);
    // sigma += 122.03 * Math.pow(fault_time, 3);
    // sigma += -30.604 * Math.pow(fault_time, 2);
    // sigma += 3.1584 * fault_time;
    // sigma += 0.1867

    // return sigma;
    return interpolate(sigma_points, fault_time);
}


// FUNCTION:
// Defines the cutoff value applied to the probability of fibrillation log normal distribution
// Dependences: None
function calculate_cutoff(fault_time) {
    // mA
    // = 692.69x-0.552
    cutoff.min = 692.69 * Math.pow(fault_time * 1000, -0.552);

    return cutoff;
}


// FUNCTION:
// Calculates the body resistance using a specified percentile (No convolution)
// Dependencies: None
function calculate_body_resistance(conditions, voltage, shock_path) {
    var percentile = parseFloat($("#percentile").val());

    var min_r, max_r;
    var resistance;

    if ($("#resistance_toggle").prop("checked")) {
        if (debug) console.log("Overriding body resistance value...");
        resistance = parseFloat($("#resistance_override").val());
    } else {
        min_r = body_resistance_threshold["min"][percentile];
        max_r = body_resistance_threshold["max"][conditions][percentile];
        resistance = interpolate(body_resistance_points[conditions][percentile], voltage);

        if (debug) console.log("Body resistance: " + min_r + " (min), " + max_r + " (max), " + resistance + " (interpolated)");

        if (resistance > max_r) resistance = max_r;
        else if (resistance < min_r) resistance = min_r;
    }
    
    if (debug) console.log("Body resistance (raw): " + resistance);

    // if (shock_path == "step") return resistance * 0.275;
    if (shock_path == "step") return resistance;
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
    p_f = NaN;

    var shock_path = $("#shock_path").val();
    var voltage = parseFloat($("#voltage").val());
    var soil_resistivity = parseFloat($("#soil_resistivity").val());
    var surface_depth = parseFloat($("#surface_depth").val());
    var surface_resistivity = parseFloat($("#surface_resistivity").val());
    var surface_conditions = $("#surface_conditions").val();
    var shoe_type = $("#shoe_type").val();
    var fault_time = parseFloat($("#fault_time").val());
    var contact_resistance = parseFloat($("#contact_resistance").val());

    var shoe_resistance = shoe_data[shoe_type].resistance;
    if (voltage > shoe_data[shoe_type].breakdown) shoe_resistance = 0;


    if (check_inputs_fibrillation()) {
        console.log("Calculating probability of fibrillation...");

        var body_resistance = calculate_body_resistance(surface_conditions, voltage, shock_path);
        var ground_resistance = calculate_ground_resistance(soil_resistivity, surface_depth, surface_resistivity);

        if (debug) console.log("Body resistance (processed): " + body_resistance);
        if (debug) console.log("Ground resistance: " + ground_resistance);
        if (debug) console.log("Shoe resistance: " + shoe_resistance);
        if (debug) console.log("Additional contact resistance (touch only): " + contact_resistance);

        var total_resistance;
        if (shock_path == "touch") total_resistance = contact_resistance + body_resistance + (ground_resistance + shoe_resistance) / 2;
        else if (shock_path == "step") total_resistance =  body_resistance + (ground_resistance + shoe_resistance) * 2;

        if (debug) console.log("Total resistance: " + total_resistance);

        // A
        var current = voltage / total_resistance;
        if (debug) console.log("Body current (raw): " + current + " A");

        if (shock_path == "step") {
            current = current / 25;
            if (debug) console.log("Body current (adjusted for step): " + current + " A");
        }

        // Check for cutoff points
        var cutoff = calculate_cutoff(fault_time);
        current_ma = current * 1000;

        if (debug) console.log("Current Cutoff: " + cutoff.min + "mA");

        var mean = define_mean(fault_time);
        if (debug) console.log("Lognormal mean: " + mean);

        var sigma = define_sd(fault_time);
        if (debug) console.log("Lognormal SD: " + sigma);

        if (p_f > 0.99) p_f = 1;
        else if (current_ma < cutoff.min) p_f = 0;
        else {
            p_f = cdfLogNormal(current * 1000, mean, sigma);
        }

        $("#PF").html(p_f.toExponential(3));
        display_chart(mean, sigma);

        if ($("#analysis_type").val() == "societal") {
            add_threshold_data(coincidence_chart, p_f);
        }
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

function generate_data(mean, sigma, current_ma=100) {
    var data = [];
    var current;

    var center = (Math.round(Math.log10(current_ma)) - 1) * 5;

    for (var i = center-5; i < center+5; i++) {
        current = Math.pow(10, i / 5 + 1);
        
        var p_f = (current_ma > cutoff.min) ? (cdfLogNormal(current, mean, sigma)).toExponential(3) : 0;
        if (p_f > 0.99) p_f = 1;

        data.push({
            x: (current).toExponential(3),
            y: p_f
        });
    }

    if (debug) console.log("Generating data...");
    if (debug) console.log(data);

    return data;
}

function display_coincidence() {
    var current_charts = $("#chart_container").html();
    if (!current_charts.includes("coincidenceChart")) $("#chart_container").html('<div class="col"><canvas id="coincidenceChart"></canvas></div><div class="col"><canvas id="resultChart"></canvas></div>');

    var ctx = $("#coincidenceChart");

    data = generate_coincidence_data(100);

    if (coincidence_chart) coincidence_chart.destroy();
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
                text: 'Societal Coincidence Curve'
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
                        labelString: "Expect at least N people affected",
                        fontSize: 18
                    }
                }]
            },
            elements: {
                point: {
                    radius: customRadius2,
                    display: true
                }
            }
        }
    });



}


function display_societal_results(p_f) {
    var ctxB = $("#fatalityChart");

    var societal_coincidence_data = generate_coincidence_data(100);

    for (var i = 0; i < societal_coincidence_data.length; i++) {
        societal_coincidence_data[i].y = (societal_coincidence_data[i].y * p_f).toExponential(3);
    }

    if (coincidence_chart_B) coincidence_chart_B.destroy();
    coincidence_chart_B = new Chart(ctxB, {
        type: "scatter",
        data: {
            datasets: [{
                label: "P_Fatality",
                borderColor: "#004F6C",
                data: societal_coincidence_data,
                showLine: true,
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                text: 'Societal Fatality Curve'
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
            },
            elements: {
                point: {
                    radius: customRadius2,
                    display: true
                }
            }
        }
    });
}


function add_threshold_data(chart, p_f) {
    // If threshold data is already present, skip
    if (chart.data.datasets.length > 1) return;
    
    var threshold;

    var safe_data = [];
    for (var i = 1; i < 10; i++) {
        threshold = 1e-6 / p_f;
        safe_data.push({
            x: i,
            y: (threshold).toExponential(3)
        });
    }
    var warning_data = [];
    for (var i = 1; i < 10; i++) {
        threshold = 1e-5 / p_f;
        warning_data.push({
            x: i,
            y: (threshold).toExponential(3)
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

function display_chart(mean, sigma) {
    var ctx = $("#resultChart");

    // Add point of interest 
    highlight_point = [{
        "x": (current_ma).toExponential(3),
        "y": (p_f).toExponential(3)
    }];

    // Generate fibrillation curve
    data = generate_data(mean, sigma, current_ma);
    // data = generate_data(mean, sigma);
    data = highlight_point.concat(data);

    // Sort data
    data.sort(function (a, b) {
        return a.x - b.x;
    });

    if (fib_chart) fib_chart.destroy();
    fib_chart = new Chart(ctx, {
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
                        max: 1,
                        // min: 1e-15,
                        maxTicksLimit: 5,
                        mirror: true
                    }
                }],
                xAxes: [{
                    type: "logarithmic",
                    scaleLabel: {
                        display: true,
                        labelString: "Current (mA)",
                        fontSize: 18
                    }
                }]
            },
            elements: {
                point: {
                    radius: customRadius,
                    display: true
                }
            }
        },
    });
}

function calculate_fatality(p_c, p_f) {
    var p_dead = p_c * p_f;

    if ($("#breaker_toggle").prop("checked")) {
        if (debug) console.log("Including breaker data in calculation...");

        var breaker_failure;
        if ($("#breaker_type").val() == "custom") breaker_failure = parseFloat($("#breaker_failure_override").val());
        else breaker_failure = parseFloat($("#breaker_failure").html());
        
        if (!(isNaN(breaker_failure))) {
            var breaker_delay 
            if ($("#breaker_type").val() == "custom") breaker_delay = parseFloat($("#breaker_time_override").val());
            else breaker_delay = parseFloat($("#breaker_time").val());

            breaker_delay = breaker_delay / 60;

            if (!(isNaN(breaker_delay))) {
                if (debug) console.log("Breaker failure rate: " + breaker_failure + "%");

                breaker_failure = breaker_failure / 100;

                if (debug) console.log("P_fatality original: " + p_dead);
                var p_dead1 = p_dead * (1 - breaker_failure);

                var original_fault_time = $("#fault_time").val();
                $("#fault_time").val(parseFloat($("#fault_time").val()) + breaker_delay);
                if (debug) console.log("Calculating P_fatality for " + $("#fault_time").val() + "s clearing time...");

                p_c = calculate_coincidence();
                p_f = calculate_fibrillation();
                p_dead2 = p_c * p_f;

                if (debug) console.log("P_fatality new: " + p_dead2);

                p_dead2 = p_dead2 * breaker_failure;
                p_dead = p_dead1 + p_dead2;

                if (!debug) $("#fault_time").val(original_fault_time);
            }
            else alert("Warning: Breaker data is missing from database. Continuing without breaker failure rates...");
        }

        else alert("Warning: Breaker data is missing from database. Continuing without breaker failure rates...");
    }

    console.log("Calculating probability of fatality...");
    if (!(isNaN(p_dead))) {
        if (p_dead > 1) p_dead = 1;
        $("#PDead").html(p_dead.toExponential(3));
        define_risk(p_dead);
        location.href = "#results";
    } else {
        if (!debug) alert("Please ensure all necessary inputs are entered correctly.");
        if (debug) console.log("Please ensure all necessary inputs are entered.");
    }

    if ($("#analysis_type").val() == "societal") {
        display_societal_results(p_f);
        add_threshold_data(coincidence_chart_B, 1);
    }
}

function inverse_voltage(current) {

    var shock_path = $("#shock_path").val();
    var voltage = parseFloat($("#voltage").val());
    var soil_resistivity = parseFloat($("#soil_resistivity").val());
    var surface_depth = parseFloat($("#surface_depth").val());
    var surface_resistivity = parseFloat($("#surface_resistivity").val());
    var surface_conditions = $("#surface_conditions").val();
    var shoe_type = $("#shoe_type").val();
    var fault_time = parseFloat($("#fault_time").val());

    var shoe_resistance = shoe_data[shoe_type].resistance;

    var body_resistance = parseFloat($("#resistance_override").val());
    var ground_resistance = calculate_ground_resistance(soil_resistivity, surface_depth, surface_resistivity);

    var total_resistance;
    if (shock_path == "touch") total_resistance = body_resistance + (ground_resistance + shoe_resistance) / 2;
    else if (shock_path == "step") total_resistance = body_resistance + (ground_resistance + shoe_resistance) * 2;
    
    if (shock_path == "step") current = current * 25;
    
    var calculated_voltage = current * total_resistance / 1000;
    // If voltage is beyond flashover voltage, recalculate without shoe resistance
    if (calculated_voltage > shoe_data[shoe_type].breakdown) {
        if (shock_path == "touch") total_resistance = body_resistance + (ground_resistance) / 2;
        else if (shock_path == "step") total_resistance = body_resistance + (ground_resistance) * 2;
    }

    return current * total_resistance / 1000;
}



function generate_design_data(prob = 1e-6) {
    var data = null;

    if (check_inputs_coincidence() && check_inputs_fibrillation()) {
        var data = [];

        var full_time_list = time_list;
        full_time_list.push(parseFloat($("#fault_time").val()));
        full_time_list.sort((a, b) => a - b);

        for (var i = 0; i < full_time_list.length; i++) {
            var mean = define_mean(full_time_list[i]);
            var sigma = define_sd(full_time_list[i]);

            current = inverse_lognormal(prob, mean, sigma);
            voltage = inverse_voltage(current);
            resistance = voltage / current;

            data.push({
                "shock time": full_time_list[i],
                "low risk current": current,
                "low risk voltage": voltage,
                "mean": mean,
                "sigma": sigma
            });

            if (debug) console.log({
                "shock time": full_time_list[i],
                "low risk current": current,
                "low risk voltage": voltage,
                "mean": mean,
                "sigma": sigma
            });
        }
    }

    return data;
}

function list_input_parameters() {
    var content = $("#kryptonForm").serializeArray();

    var parameters = {};
    for (var i=0; i < content.length; i=i+1) {
        parameters[content[i].name] = content[i].value;
    }

    content = $("#settingForm").serializeArray();
    for (var i=0; i < content.length; i=i+1) {
        parameters[content[i].name] = content[i].value;
    }

    parameters["breaker_delay"] = ($("#breaker_type").val() == "custom") ? $("#breaker_time_override").val() : $("#breaker_time").val();
    parameters["breaker_failure"] = ($("#breaker_type").val() == "custom") ? $("#breaker_failure_override").val() : $("#breaker_failure").html();

    if (debug) console.log(parameters);
    return parameters;
}

function define_breaker_failure() {
    var breaker_type = $("#breaker_type").val();

    if (breaker_type == "custom") return parseFloat($("#breaker_time_override").val())

    var transmission_v = $("#voltage_type").val();
    var breaker_number = parseFloat($("#breaker_number").val());

    if (debug) console.log("Breaker Type: " + breaker_type);
    if (debug) console.log("Transmission Voltage: " + transmission_v);
    if (debug) console.log("Number of Breakers: " + breaker_number);

    var breaker_failure = breaker_data[breaker_type].prob[transmission_v];
    if (breaker_failure == null) $("#breaker_failure").html("missing from database.");
    else $("#breaker_failure").html((breaker_failure * 100 * breaker_number).toFixed(2) + "%");

    var breaker_delay = breaker_data[breaker_type].delay[transmission_v]; 
    if (breaker_delay == null) {
        breaker_delay = 0;
        $("#breaker_time").val("");
    }
    else $("#breaker_time").val(breaker_delay);

    breaker_delay = breaker_delay / 60;
    if (debug) console.log("Breaker Delay: " + breaker_delay + " s");

    return breaker_delay;
}

$(document).ready(function () {

    $("#submitButton").click(function () {

        var content = $("#kryptonForm").serializeArray();

        var templateData = {};
        for (var i=0; i < content.length; i=i+1) {
            templateData[content[i].name] = content[i].value;
        }

        if ($("#templateName").val() === "") {
            if (!debug) alert("Please choose a template name!")
            return;
        }

        var template = {};
        template[$("#templateName").val()] = templateData;

        var jsonData = JSON.stringify(template);
        jsonData = jsonData.slice(1, jsonData.length-1);
        var file_name = $("#templateName").val();

        download(jsonData, file_name + '_template.json', 'application/json');
        jQuery('#templateModal').modal('hide');
        $("form").trigger("reset");
    });

    // Fill default templates list
    for (var i in default_values) {
        $("#default_list").append('<option value="' + i + '">' + i + '</option>'); 
    }

    // Fill shoe list
    for (var i in shoe_data) {
        $("#shoe_type").append('<option value="' + i + '">' + shoe_data[i].name + '</option>'); 
    }

    // Fill shoe list
    for (var i in breaker_data) {
        $("#breaker_type").append('<option value="' + i + '">' + breaker_data[i].name + '</option>'); 
    }
    
    // ------------- CALCULATE --------------//
    $("#calculate").click(function () {
        console.log("Calculating...");
        var p_c = calculate_coincidence();

        console.log("GPR data: " + gpr_data_valid);

        var p_f = calculate_fibrillation();

        calculate_fatality(p_c, p_f);

        if (gpr_data_valid && $("#analysis_type").val() == "societal") calculate_gpr();
    });
    $(".krypton-input").keyup(function (e) {
        // Check for enter key
        if (e.which == 13) {
            console.log("Calculating...");
            var p_c = calculate_coincidence();

            console.log("GPR data: " + gpr_data_valid);
            
            var p_f = calculate_fibrillation();

            calculate_fatality(p_c, p_f);

            if (gpr_data_valid && $("#analysis_type").val() == "societal") calculate_gpr();
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
        window.open("Krypton User Guide.pdf", "_blank");
    });

    $(".fa-bolt").click(function () {
        $(".fa-bolt").effect( "pulsate", {"times":5},  100).dequeue().effect( "bounce", {"distance" : 50});
    })
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

    $('#shock_path').change(function () {
        var type = this.value;

        if (type == "touch") {
            $(".touch").show();
            $("#surface_conditions").val("dry");
        }
        else {
            $(".touch").hide();
            $("#surface_conditions").val("salt");
        }
    });

    $("#surface_depth").change(function () {
        if (this.value == "0") {
            $("#surface_resistivity").attr("disabled", "disabled");
            $("#surface_resistivity").val("");
        } else $("#surface_resistivity").removeAttr("disabled");
    });

    $("#breaker_toggle").change(function () {
        if (this.checked === true) {
            $(".breaker").show();
            if ($("#breaker_type").val() == "custom") {
                $(".other").show();
                $(".regular").hide();
            }
            else {
                $(".other").hide();
                $(".regular").show();
                define_breaker_failure();
            }
        }
        else {
            $(".breaker").hide();
            $("#breaker_time").hide();
        }
        define_breaker_failure();
    });

    $("#resistance_toggle").change(function () {
        if (this.checked === true) $(".resistance").show();
        else $(".resistance").hide();
    });

    $("#shoe_type").change(function () {
        $("#shoe_breakdown").html("Flashover Voltage: " + shoe_data[$("#shoe_type").val()].breakdown + "V")
    });

    $("#fault_time").change(function () {
        if (parseFloat($("#fault_time").val()) > 1.1) $("#fault_time_warning").html("Warning: Result may be inaccurate due to extrapolation beyond 1s.");
        else $("#fault_time_warning").html("");
    });

    $(".breaker").change(function () {
        if ($("#breaker_type").val() == "custom") {
            $(".other").show();
            $(".regular").hide();
        }
        else {
            $(".other").hide();
            $(".regular").show();
            define_breaker_failure();
        }
    });

    $(".scientific").change(function () {
        if (this.value === "") alert("Please set a threshold!");
        this.value = Number(this.value).toExponential(2);
    });

    $("#exportCSV").click(function () {
        data = generate_design_data();
        var secondary_data = [];
        secondary_data.push(list_input_parameters());

        if (debug) console.log(data);
        if (debug) console.log(secondary_data);

        if (data !== null) {
            console.log("Generating CSV...");
            date = new Date()
            date_string = date.toLocaleDateString().replace(/\//g, "_");
            exportToCsv("KryptonReport-" + date_string + ".csv", data, secondary_data);
        } else {
            console.log("No data available to generate CSV.");
            if (!debug) alert("No data available to generate CSV. Please calculate first!");
        }
    });

    $("#load_button").click(function () {
        load_defaults();
    });

    $("#load_toggle").change(function() {
        // Save
        if (this.checked === true) {
            $(".save").show();
            $(".load").hide();
        }

        // Load
        else {
            $(".save").hide();
            $(".load").show();
        }
    });

    $("#population").change(function() {
        if (this.value < 2) {
            this.value = 2;
        }
        this.value=Math.round(this.value); 
    });
    
    $("#gpr_population").change(function() {
        if (this.value < 2) {
            this.value = 2;
        }
        this.value=Math.round(this.value); 
    });

    // ----------------------------------//
});