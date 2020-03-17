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
            "500": 2
        },
        "prob" : {
            "69": 0.000173,
            "138": 0.000518,
            "230": 0.000603,
            "500": null
        }
    },
    "dead_tank": {
        "name" : "Dead Tank",
        "delay" : {
            "69": 15,
            "138": 10,
            "230": 6,
            "500": 2
        },
        "prob" : {
            "69": null,
            "138": 0.000288,
            "230": 0.000565,
            "500": 0.000763
        }
    },
    "air_blast": {
        "name" : "Air Blast",
        "delay" : {
            "69": 15,
            "138": 10,
            "230": 6,
            "500": 2
        },
        "prob" : {
            "69": 0.000122,
            "138": 0.000556,
            "230": 0.001548,
            "500": 0.000961
        }
    },
    "min_oil" : {
        "name" : "Min Oil",
        "delay" : {
            "69": 15,
            "138": 10,
            "230": 6,
            "500": 2
        },
        "prob" : {
            "69": 0.000242,
            "138": 0.000159,
            "230": 0.000098,
            "500": 0.000347
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