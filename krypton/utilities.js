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

function exportToCsv(filename, data) {
    var csvFile = '';
    var keys = '';
    var values;

    for (key in data[0]) {
        keys += key.toString() + ",";
    }
    keys = keys.substring(0, keys.length - 1);
    csvFile += keys + "\n";

    for (var i = 0; i < data.length; i++) {
        values = '';
        for (key in data[i]) {
            values += data[i][key].toString() + ",";
        }
        values = values.substring(0, values.length - 1);
        csvFile += values + "\n";
    }

    download(csvFile, filename, 'text/csv;charset=utf-8;');
}

// https://stackoverflow.com/questions/12556685/is-there-a-javascript-implementation-of-the-inverse-error-function-akin-to-matl
function erfINV(inputX) {
    var _a = ((8 * (Math.PI - 3)) / ((3 * Math.PI) * (4 - Math.PI)));
    var _x = parseFloat(inputX);
    var signX = ((_x < 0) ? -1.0 : 1.0);

    var oneMinusXsquared = 1.0 - (_x * _x);
    var LNof1minusXsqrd = Math.log(oneMinusXsquared);
    var PI_times_a = Math.PI * _a;

    var firstTerm = Math.pow(((2.0 / PI_times_a) + (LNof1minusXsqrd / 2.0)), 2);
    var secondTerm = (LNof1minusXsqrd / _a);
    var thirdTerm = ((2 / PI_times_a) + (LNof1minusXsqrd / 2.0));

    var primaryComp = Math.sqrt(Math.sqrt(firstTerm - secondTerm) - thirdTerm);

    var scaled_R = signX * primaryComp;
    return scaled_R;
}

function inverse_lognormal(prob, mean, sd) {
    prob = (prob - 0.5) * 2;
    result = erfINV(prob);
    result = (result * Math.pow(2, 0.5) * sd) + mean;

    return Math.exp(result);
}



/* FUTURE CONVOLUTION IMPLEMENTATION TESTING */
// function get_body_resistance(percentile) {
//     return 728.89 * Math.exp(0.0118 * percentile);
// }

// function p_fib_v2() {
//     var p_f = NaN;

//     var shock_path = $("#shock_path").val();
//     var voltage = parseFloat($("#voltage").val());
//     var soil_resistivity = parseFloat($("#soil_resistivity").val());
//     var surface_depth = parseFloat($("#surface_depth").val());
//     var surface_resistivity = parseFloat($("#surface_resistivity").val());
//     var surface_conditions = $("#surface_conditions").val();
//     var shoe_type = $("#shoe_type").val();
//     var fault_time = parseFloat($("#fault_time").val());

//     var shoe_resistance;
//     switch (shoe_type) {
//         case "foot":
//             shoe_resistance = 0;
//             break;
//     }

//     var mean = define_mean(fault_time);
//     var sigma = define_sd(fault_time);

//     var count = 0;
//     for (var i=1; i<=100; i++) {
//         console.log("Calculating probability of fibrillation...");

//         var body_resistance = get_body_resistance(i);
//         var ground_resistance = calculate_ground_resistance(soil_resistivity, surface_depth, surface_resistivity);

//         if (debug) console.log("Body resistance (processed): " + body_resistance);
//         if (debug) console.log("Ground resistance: " + ground_resistance);

//         var total_resistance;
//         if (shock_path == "touch") total_resistance = body_resistance + (ground_resistance + shoe_resistance) / 2;
//         else if (shock_path == "step") total_resistance = body_resistance + (ground_resistance + shoe_resistance) * 2;

//         if (debug) console.log("Total resistance: " + total_resistance);

//         var current = voltage / total_resistance;
//         if (debug) console.log("Body current (raw): " + current + " A");

//         if (shock_path == "step") {
//             current = current / 25;
//             if (debug) console.log("Body current (adjusted for step): " + current + " A");
//         }

//         for (var j=1; j<=100; j++) {
//             var current2 = inverse_lognormal(j/100, mean, sigma);
//             if (current * 1000 * i * j / 10000 > current2) count += 1 * i * j / 10000;
//         }

//     }
//     return count;
// }
