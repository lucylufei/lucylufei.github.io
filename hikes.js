$(document).ready(function () {
    var vw = $(window).width();
    var n_columns;
    if (vw < 768) {
        n_columns = Math.floor(vw / 150);
    } else {
        n_columns = Math.floor(vw / 300);
    }
    $('.card-columns').css('column-count', n_columns);
});

$(document).ready(function () {
    // Get all the different regions in hikes
    var regions = [];
    var region_names = [];
    $(".card").each(function () {
        var region = $(this).data("region");
        if (!regions.includes(region)) {
            regions.push(region);

            // Clean up region names
            // Replace dashes with spaces
            region_name = region.replace(/-/g, " ");
            // Capitalize every first letter
            region_name = region_name.replace(/\b\w/g, function (char) {
                return char.toUpperCase();
            });

            // If BC is in the name, replace it with British Columbia
            if (region_name.includes("Bc")) {
                region_name = region_name.replace("Bc", "BC");
            }

            // Track region and region name together
            region_names.push({region: region, region_name: region_name});
        }
    });

    // Sort the regions
    region_names.sort();

    // Create the select box
    var select = $("#filter");
    region_names.forEach(function (region) {
        select.append("<option value='" + region.region + "'>" + region.region_name + "</option>");
    });
});

// Function
function sort_hikes(hikes, selected, checked) {
    console.log("Sorting hikes by " + selected + " and checked: " + checked);
    // Filter hikes
    hikes.each(function () {
        var done = $(this).hasClass("done");
        var region = $(this).data("region");

        // Check for class done
        if (checked && done) {
            $(this).hide();
        } else {
            // Check filters
            if (selected == "all") {
                $(this).show();
            } else if (region === selected) {
                $(this).show();
            } else {
                $(this).hide();
            }
        }
    });
}

$(document).ready(function () {
    // on change of the select box
    $("#sorting").change(function () {
        // get the selected value
        var selected = $(this).val();
        console.log("Sorting by " + selected);

        // sort the hikes
        var hikes = $(".card");

        if (selected === "rating" || selected === "est-year") {
            hikes.sort(function (a, b) {
                var aVal = $(a).data(selected);
                var bVal = $(b).data(selected);
                
                if (aVal < bVal) {
                    return 1;
                } else if (aVal > bVal) {
                    return -1;
                } else {
                    return 0;
                }
            });
        }
        else {
            hikes.sort(function (a, b) {
                var aVal = $(a).data(selected);
                var bVal = $(b).data(selected);
                
                if (aVal < bVal) {
                    return -1;
                } else if (aVal > bVal) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        // empty the container
        $(".card-columns").empty();
        // append the sorted hikes
        hikes.each(function () {
            $(".card-columns").append($(this));
        });
    });

    $("#toggle-done").change(function () {
        var checked = $(this).prop('checked');
        var hikes = $(".card");
        var selected = $("#filter").val();
        console.log("Toggle done hikes: " + checked);
        sort_hikes(hikes, selected, checked);
    });

    $("#filter").change(function () {
        var hikes = $(".card");
        var selected = $(this).val();
        var checked = $("#toggle-done").prop('checked');
        console.log("Filtering by " + selected);
        sort_hikes(hikes, selected, checked);
    });
});