
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
