function load_skills() {
    var skills = [
        "Verilog",
        "MATLAB",
        "C",
        "Python",
        "HTML/CSS",
        "JavaScript",
        "Circuit Analysis",
        "PCB Design",
        "Assembly",
        "VLSI Design",
        "PCIe",
        "FPGA",
        "Microcontrollers",
        "Altera Quartus",
        "ModelSim"
    ];

    skills.sort();

    for (var i=0; i<skills.length; i++) {
        span_string = "<span class='badge badge-skills'> " + skills[i] + " </span> &nbsp;";
        $("#skills-list").append(span_string);
    }
}



$(document).ready(function () {
    var award_closed = true;

    load_skills();

    $(".hidden").hide();
    $(".cv").hide();
    $(".job-details").hide();
    $(".details").hide();

    $("#switch").change(function () {
        console.log(this);

        if (this.checked == true) {
            $("#title").hide();
            $("#title").html("CV");

            $("#title").animate({
                opacity: "toggle"
            }, "slow");

            $(".cv").show();
            $(".resume").hide();
        } else {
            $("#title").hide();
            $("#title").html("Resume");

            $("#title").animate({
                opacity: "toggle"
            }, "slow");

            $(".cv").hide();
            $(".resume").show();
        }

        if ($(window).innerWidth() <= 1050) {
            $(".desktop-only").hide();
        } else {
            $(".mobile-only").hide();
        }
    });

    $(".job").click(function () {
        var job = this.id;
        $("#" + job + "-details").animate({
            height: "toggle"
        });

    });

    $("#award").click(function() {
        $("#award-details").animate({
            height: "toggle"
        });

        if (award_closed) {
            $("#award").html($("#award").html().replace("down", "up"));
            award_closed = false;
        }
        else {
            $("#award").html($("#award").html().replace("up", "down"));
            award_closed = true;
        }
    });
})