/*----- GLOBAL PARAMETERS -----*/
var debug = false;

// Circuit Breaker Delay Data
var breaker_delay_data = {
    "bulk_oil": {
        "69": 15,
        "138": 10,
        "230": 6,
        "500": 2
    },
    "dead_tank": {
        "69": 15,
        "138": 10,
        "230": 6,
        "500": 2
    },
    "air_blast": {
        "69": 15,
        "138": 10,
        "230": 6,
        "500": 2
    },
    "min_oil" : {
        "69": 15,
        "138": 10,
        "230": 6,
        "500": 2
    }
}

// Circuit Breaker Data
var breaker_data = {
    "bulk_oil": {
        "69": 0.000173,
        "138": 0.000518,
        "230": 0.000603,
        "500": null
    },
    "dead_tank": {
        "69": null,
        "138": 0.000288,
        "230": 0.000565,
        "500": 0.000763
    },
    "air_blast": {
        "69": 0.000122,
        "138": 0.000556,
        "230": 0.001548,
        "500": 0.000961
    },
    "min_oil" : {
        "69": 0.000242,
        "138": 0.000159,
        "230": 0.000098,
        "500": 0.000347
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