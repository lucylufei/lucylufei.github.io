// Other global variables
var p_f = NaN;
var current_ma = NaN;


// Global chart variable
var coincidence_chart;
var coincidence_chart_B;

// Log Normal Standard Deviation
var sd = 0.35;

var mu_points = [
    {'x': 0.1, 'y': 6.6786},
    {'x': 0.2, 'y': 6.3911},
    {'x': 0.3, 'y': 6.1039},
    {'x': 0.4, 'y': 5.6978},
    {'x': 0.5, 'y': 5.2983},
    {'x': 0.6, 'y': 5.0067},
    {'x': 0.7, 'y': 4.6111},
    {'x': 0.8, 'y': 4.5041},
    {'x': 0.9, 'y': 4.3881},
    {'x': 1.0, 'y': 4.3222}
];

var sigma_points = [
    {'x': 0.1, 'y': 0.2979},
    {'x': 0.2, 'y': 0.2720},
    {'x': 0.3, 'y': 0.2924},
    {'x': 0.4, 'y': 0.3372},
    {'x': 0.5, 'y': 0.4214},
    {'x': 0.6, 'y': 0.3979},
    {'x': 0.7, 'y': 0.3387},
    {'x': 0.8, 'y': 0.3210},
    {'x': 0.9, 'y': 0.2891},
    {'x': 1.0, 'y': 0.2691}
];


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
