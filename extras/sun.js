let lat = 49.2722;
let tree = -30;
let house = 15;

let treeRatio = 2;
let houseRatio = 1.5;


let dayNum = 140;
let az = calculateAz(dayNum);


function calculateHours() {
    az = calculateAz(dayNum);

    let totalHours = 0;

    // Calculate for each hour (6AM to 10PM)
    for (var i = 6; i < 20; i++) {
        // Calculate H
        let H = (12 - i) * 15;

        // Calculate Beta
        let beta = (Math.cos(toRad(lat)) * Math.cos(toRad(az)) * Math.cos(toRad(H))) + (Math.sin(toRad(lat)) * Math.sin(toRad(az)));
        beta = toDegree(Math.asin(beta));

        // Calculate Phi
        let phi = (Math.cos(toRad(az)) * Math.sin(toRad(H))) / Math.cos(toRad(beta));
        phi = toDegree(Math.asin(phi));

        console.log(`At ${Math.round(i)}:00, the sun is ${Math.round(phi)} degrees East and ${Math.round(beta)} degrees in the sky.`);

        // Check if there's sun
        if (phi < house && phi > tree) {
            // Unconditional sun
            console.log("Nothing is blocking the sun.");
            totalHours++;
        } else {
            if (phi > house) {
                if (Math.atan(beta) > houseRatio) {
                    // Sun above roof
                    console.log("The sun is above the roof.");
                    totalHours++;
                }
                else console.log("The sun is behind the house.");
            } else if (phi < tree) {
                if (Math.atan(beta) > treeRatio) {
                    // Sun above tree
                    console.log("The sun is above the trees.");
                    totalHours++;
                }
                else console.log("The sun is behind the trees.");
            }
        }
    }
}

function calculateAz(dayNum) {
    return 23.45 * Math.sin(toRad(360 / 365 * (dayNum - 81)));
}


function toRad(degrees) {
    return degrees * Math.PI / 180;
}

function toDegree(rad) {
    return rad * 180 / Math.PI;
}