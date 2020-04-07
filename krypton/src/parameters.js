/*----- GLOBAL PARAMETERS -----*/
var debug = false;

// Circuit Breaker Delay Data
var breaker_data = {
    "bulk_oil": {
        "name" : "Bulk Oil",
        "delay" : {
            "69": 15,
            "138": 10,
            "230": 6,
            "287": 4,
            "360": 3,
            "500": 2
        },
        "prob" : {
            "69": 0.02,
            "138": 0.04,
            "230": 0.21,
            "287": 0.21,
            "360": null,
            "500": null
        }
    },
    "dead_tank": {
        "name" : "Dead Tank",
        "delay" : {
            "69": 15,
            "138": 10,
            "230": 6,
            "287": 4,
            "360": 3,
            "500": 2
        },
        "prob" : {
            "69": 0.005,
            "138": 0.03,
            "230": 0.05,
            "287": 0.05,
            "360": null,
            "500": 0.08
        }
    },
    "air_blast": {
        "name" : "Air Blast",
        "delay" : {
            "69": 15,
            "138": 10,
            "230": 6,
            "287": 4,
            "360": 3,
            "500": 2
        },
        "prob" : {
            "69": 0.01,
            "138": 0.05,
            "230": 0.14,
            "287": 0.14,
            "360": 0.09,
            "500": 0.09
        }
    },
    "min_oil" : {
        "name" : "Minimum Oil",
        "delay" : {
            "69": 15,
            "138": 10,
            "230": 6,
            "287": 4,
            "360": 3,
            "500": 2
        },
        "prob" : {
            "69": 0.02,
            "138": 0.01,
            "230": 0.01,
            "287": 0.01,
            "360": 0.03,
            "500": null
        }
    }
}

// Societal probability of coincidence limit (below this is negligible, considered 0%)
var p_c_threshold = 1e-10;


// Shoe data (resistance and flashover voltage)
var shoe_data = {
    "foot" : {
        "name" : "Bare Feet",
        "resistance" : 0,
        "breakdown" : 0
    },

    "leather_shoe" : {
        "name" : "Leather Shoes",
        "resistance" : 1000000,
        "breakdown" : 5000
    },

    "rubber_shoe" : {
        "name" : "Rubber Shoes",
        "resistance" : 1000,
        "breakdown" : 2500
    },

    "wet_shoe" : {
        "name" : "Wet Rubber Shoes", 
        "resistance": 500,
        "breakdown" : 750
    },

    "safety_shoes" : {
        "name" : "Elastomer Safety Boots",
        "resistance" : 6000000,
        "breakdown" : 15000
    }

}