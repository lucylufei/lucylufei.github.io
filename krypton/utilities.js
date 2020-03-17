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


function customRadius(context) {
    let index = context.dataIndex;
    let value = context.dataset.data[index];
    return (value.x == current_ma) ?
        15 :
        2;
}


// FUNCTION:
// Interpolate between two points
// p1: x, y
// p2: x, y
function interpolate(p1, p2, x) {
    var slope = (p2.y - p1.y) / (p2.x - p1.x);
    return p1.y + (x * slope);
}


function load_defaults() {
    if (debug) console.log("Loading defaults... ");

    var template = $("#default_list").val();

    for (var i in default_values[template]) {
        if (debug) console.log("Setting " + i);
        $("#" + i).val(default_values[template][i]);
        $("#" + i).change();
    }
}