/*----- GLOBAL PARAMETERS -----*/
var debug = false;

// Log Normal Standard Deviation
var sd = 0.35;

// Temporary breaker delay value
var breaker_delay = 0.1;

// Global chart variable
var coincidence_chart;
var coincidence_chart_B;


// Circuit Breaker Data
var breaker_data = {
    "bulk_oil": {
        "69": null,
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

// Societal probability of coincidence limit (below this is negligible, considered 0%)
var p_c_threshold = 1e-10;

var p_f = NaN;
var current_ma = NaN;