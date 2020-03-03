/*----- GLOBAL PARAMETERS -----*/
var debug = true;

// Circuit Breaker Delay Data
var breaker_delay_data = {
    "bulk_oil": {
        "69": null,
        "138": 6,
        "230": 6,
        "500": 6
    },
    "dead_tank": {
        "69": 6,
        "138": 6,
        "230": 6,
        "500": 6
    },
    "air_blast": {
        "69": 6,
        "138": 6,
        "230": 6,
        "500": 6
    }
}

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

// Shoe breakdown
var shoe_breakdown_data = {
    "foot" : 0,
    "shoe" : 1000,
    "boot" : 2000
};

// Shoe resistance
var shoe_resistance_data = {
    "foot" : 0,
    "shoe" : 100,
    "boot" : 200
};