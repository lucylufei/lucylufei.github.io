
/*----- GLOBAL PARAMETERS -----*/
var debug = true;

// Log Normal Standard Deviation
var sd = 0.3;

// Temporary breaker delay value
var breaker_delay = 0.1;

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
