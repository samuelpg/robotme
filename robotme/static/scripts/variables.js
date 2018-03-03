$(document).ready((function () {
    $(".element-output").draggable({
        helper: "clone",
        revert: "invalid",
        snap: ".output-pin-marker", 
        snapMode: "inner",
        snapTolerance: 30
    });

    $(".element-input").draggable({
        helper: "clone",
        revert: "invalid",
        snap: ".input-pin-marker", 
        snapMode: "inner",
        snapTolerance: 50
    });

    $(".input-pin-marker").droppable({
        accept: ".element-input",
        drop: function (event, ui) {
            //$(ui.draggable[0]).offset($('#pinout1').offset());
            $(this).append($(ui.helper).clone());
            $(this).removeClass("input-pin-marker");
        }

    });
    $(".output-pin-marker").droppable({
        accept: ".element-output",
        drop: function (event, ui) {
            $(this).append($(ui.helper).clone());
            $(this).removeClass("output-pin-marker");
        }
    });
}));