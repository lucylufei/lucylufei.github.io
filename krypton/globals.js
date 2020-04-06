// Global chart variable
var coincidence_chart;
var coincidence_chart_B;
var fib_chart;
var gpr_avg_chart;
var gpr_best_chart;
var gpr_worst_chart;

// Other global variables
var p_f = NaN;
var current_ma = NaN;
var cutoff = {
    "min": null,
    "max": null
};

// Log Normal Standard Deviation
var sd = 0.35;

var mu_points = [
    {'x': 0.01, 'y': 7.308542797 },
    {'x': 0.02, 'y': 7.308542797 },
    {'x': 0.03, 'y': 7.308542797 },
    {'x': 0.05, 'y': 7.254177777 },
    {'x': 0.1, 'y': 7.104355031 },
    {'x': 0.2, 'y': 6.863434761 },
    {'x': 0.3, 'y': 6.619447356 },
    {'x': 0.4, 'y': 6.345511311 },
    {'x': 0.5, 'y': 6.095238796 },
    {'x': 0.6, 'y': 5.822510904 },
    {'x': 0.7, 'y': 5.508836317 },
    {'x': 0.8, 'y': 5.261146129 },
    {'x': 0.9, 'y': 5.094130017 },
    {'x': 1, 'y': 4.928669412 },
    {'x': 1.25, 'y': 4.70953019 },
    {'x': 1.5, 'y': 4.605170146 },
    {'x': 2, 'y': 4.488636447 },
    {'x': 3, 'y': 4.442651179 },
    {'x': 4, 'y': 4.442651179 },
    {'x': 10, 'y': 4.442651179 }
];

var sigma_points = [
    {'x': 0.01, 'y': 0.253467478 },
    {'x': 0.02, 'y': 0.253467478 },
    {'x': 0.03, 'y': 0.253467478 },
    {'x': 0.05, 'y': 0.258664777 },
    {'x': 0.1, 'y': 0.250958672 },
    {'x': 0.2, 'y': 0.26456985 },
    {'x': 0.3, 'y': 0.295020952 },
    {'x': 0.4, 'y': 0.334578069 },
    {'x': 0.5, 'y': 0.415962158 },
    {'x': 0.6, 'y': 0.450300804 },
    {'x': 0.7, 'y': 0.428725651 },
    {'x': 0.8, 'y': 0.392472863 },
    {'x': 0.9, 'y': 0.386517539 },
    {'x': 1, 'y': 0.347314265 },
    {'x': 1.25, 'y': 0.297912517 },
    {'x': 1.5, 'y': 0.280897609 },
    {'x': 2, 'y': 0.260323275 },
    {'x': 3, 'y': 0.287174056 },
    {'x': 4, 'y': 0.287174056 },
    {'x': 10, 'y': 0.287174056 }
];

var body_resistance_points = {
    "dry" : {
        "5" : [
            {"x" : 25, "y": 1750 },
            {"x" : 50, "y": 1375 },
            {"x" : 75, "y": 1125 },
            {"x" : 100, "y": 990 },
            {"x" : 125, "y": 900 },
            {"x" : 150, "y": 850 },
            {"x" : 175, "y": 825 },
            {"x" : 200, "y": 800 },
            {"x" : 225, "y": 775 },
            {"x" : 400, "y": 700 },
            {"x" : 500, "y": 625 },
            {"x" : 700, "y": 575 }
        ],
        "50" : [
            {"x" : 25, "y": 3250 },
            {"x" : 50, "y": 2500 },
            {"x" : 75, "y": 2000 },
            {"x" : 100, "y": 1725 },
            {"x" : 125, "y": 1550 },
            {"x" : 150, "y": 1400 },
            {"x" : 175, "y": 1325 },
            {"x" : 200, "y": 1275 },
            {"x" : 225, "y": 1225 },
            {"x" : 400, "y": 950 },
            {"x" : 500, "y": 850 },
            {"x" : 700, "y": 775 }
        ],
        "95" : [
            {"x" : 25, "y": 6100 },
            {"x" : 50, "y": 4600 },
            {"x" : 75, "y": 3600 },
            {"x" : 100, "y": 3125 },
            {"x" : 125, "y": 2675 },
            {"x" : 150, "y": 2350 },
            {"x" : 175, "y": 2175 },
            {"x" : 200, "y": 2050 },
            {"x" : 225, "y": 1900 },
            {"x" : 400, "y": 1275 },
            {"x" : 500, "y": 1150 },
            {"x" : 700, "y": 1050 }            
        ]
    },
    "wet" : {
        "5" : [
            {"x" : 25, "y": 1175 },
            {"x" : 50, "y": 1100 },
            {"x" : 75, "y": 1025 },
            {"x" : 100, "y": 975 },
            {"x" : 125, "y": 900 },
            {"x" : 150, "y": 850 },
            {"x" : 175, "y": 825 },
            {"x" : 200, "y": 800 },
            {"x" : 225, "y": 775 },
            {"x" : 400, "y": 700 },
            {"x" : 500, "y": 625 },
            {"x" : 700, "y": 575 }            
        ],
        "50" : [
            {"x" : 25, "y": 2175 },
            {"x" : 50, "y": 2000 },
            {"x" : 75, "y": 1825 },
            {"x" : 100, "y": 1675 },
            {"x" : 125, "y": 1550 },
            {"x" : 150, "y": 1400 },
            {"x" : 175, "y": 1325 },
            {"x" : 200, "y": 1275 },
            {"x" : 225, "y": 1225 },
            {"x" : 400, "y": 950 },
            {"x" : 500, "y": 850 },
            {"x" : 700, "y": 775 }            
        ],
        "95" : [
            {"x" : 25, "y": 4100 },
            {"x" : 50, "y": 3675 },
            {"x" : 75, "y": 3275 },
            {"x" : 100, "y": 2950 },
            {"x" : 125, "y": 2675 },
            {"x" : 150, "y": 2350 },
            {"x" : 175, "y": 2175 },
            {"x" : 200, "y": 2050 },
            {"x" : 225, "y": 1900 },
            {"x" : 400, "y": 1275 },
            {"x" : 500, "y": 1150 },
            {"x" : 700, "y": 1050 },            
        ]
    },
    "salt" : {
        "5" : [
            {"x" : 25, "y": 960 },
            {"x" : 50, "y": 940 },
            {"x" : 75, "y": 920 },
            {"x" : 100, "y": 880 },
            {"x" : 125, "y": 850 },
            {"x" : 150, "y": 830 },
            {"x" : 175, "y": 810 },
            {"x" : 200, "y": 790 },
            {"x" : 225, "y": 770 },
            {"x" : 400, "y": 700 },
            {"x" : 500, "y": 625 },
            {"x" : 700, "y": 575 }            
        ],
        "50" : [
            {"x" : 25, "y": 1300 },
            {"x" : 50, "y": 1275 },
            {"x" : 75, "y": 1250 },
            {"x" : 100, "y": 1225 },
            {"x" : 125, "y": 1200 },
            {"x" : 150, "y": 1180 },
            {"x" : 175, "y": 1155 },
            {"x" : 200, "y": 1135 },
            {"x" : 225, "y": 1115 },
            {"x" : 400, "y": 950 },
            {"x" : 500, "y": 850 },
            {"x" : 700, "y": 775 }            
        ],
        "95": [
            {"x" : 25, "y": 1755 },
            {"x" : 50, "y": 1720 },
            {"x" : 75, "y": 1685 },
            {"x" : 100, "y": 1655 },
            {"x" : 125, "y": 1620 },
            {"x" : 150, "y": 1590 },
            {"x" : 175, "y": 1560 },
            {"x" : 200, "y": 1530 },
            {"x" : 225, "y": 1505 },
            {"x" : 400, "y": 1275 },
            {"x" : 500, "y": 1150 },
            {"x" : 700, "y": 1050 }            
        ]
    }
}

var body_resistance_threshold = {
    "max" : {
        "dry" : {
            "5" : 1750,
            "50" : 3250, 
            "95" : 6100
        }, 
        "wet" : {
            "5" : 1175,
            "50" : 2175,
            "95" : 4100
        },
        "salt" : {
            "5" : 960,
            "50" : 1300,
            "95" : 1755
        }
    },
    "min" : {
        "5" : 575,
        "50" : 775,
        "95" : 1050
    }
}

// List of time steps
var time_list = [
    0.01,
    0.02,
    0.05,
    0.1,
    0.2,
    0.3,
    0.4,
    0.5,
    0.6,
    0.7,
    0.8,
    0.9,
    1
];


var gpr_data = [];
var gpr_data_valid = false;

var gpr_helptext = 'Copy two columns from Excel. The first column should contain the step voltage potential. The second column should contain the radial distance from the center of the structure. Click "Process" and confirm that the data is correct.'