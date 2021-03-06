//CONSTANTS
const servo = "../static/assets/007-servo.svg";
const dc = "../static/assets/003-technology.svg";
const led = "../static/assets/006-diode.svg";
const buzzer = "../static/assets/005-buzzer.svg";
const button = "../static/assets/001-switch.svg";
const pir = "../static/assets/004-sensor.svg";
//TEMPLATES
//template for variables table
const row = (pin, type, name) => {
    let color = "";
    switch (type) {
        case "servo":
            {
                color = "purple";
                break;
            }
        case "dc":
            {
                color = "teal";
                break;
            }
        case "led":
            {
                color = "green";
                break;
            }
        case "buzzer":
            {
                color = "blue";
                break;
            }
        case "button":
            {
                color = "pink";
                break;
            }
        case "pir":
            {
                color = "orange"
                break;
            }
    }
    return `<tr id="row-${pin}" class="table-selected-row">
        <td>
            <div class="mini-element ${color}">${pin}</div>
        </td>
        <td>
            <input class="table-input" max="20" onchange="checkInput(this)" id="input-${pin}" value="${name}">
        </td>
    </tr>`
}

//template for variables icon on pi 
const variable = (pin_variable, tpe_variable) => {
    let color = "";
    let url = "";
    switch (tpe_variable) {
        case "servo":
            {
                color = "purple";
                url = servo;
                break;
            }
        case "dc":
            {
                color = "teal";
                url = dc;
                break;
            }
        case "led":
            {
                color = "green";
                url = led;
                break;
            }
        case "buzzer":
            {
                color = "blue";
                url = buzzer;
                break;
            }
        case "button":
            {
                color = "pink";
                url = button;
                break;
            }
        case "pir":
            {
                color = "orange";
                url = pir;
                break;
            }
    }
    return `<div id="selected-${pin_variable}" class="element ${color} selected-variable" data-value="${pin_variable}" style="position:absolute">
        <img src="${url}" alt="">
    </div>`
}

//GLOBAL VARIABLES
//array of all variables
let variables = new Array();
let slug = "";
//FUNCTIONS
//on getting the variables, fill table and pi
const draw = () => {
    for (let i = 0; i < variables.length; i++) {
        let varData = variables[i];
        $(`#pin-${varData['pin_variable']}`).append(variable(varData['pin_variable'], varData['tpe_variable'])).droppable('disable');
        $(`#selected-${varData['pin_variable']}`).draggable()
        $(`#selected-${varData['pin_variable']}`).draggable({
            revert: "invalid",
            snap: ".delete-drop-zone",
            snapMode: "inner",
            snapTolerance: 50,
            containment: $('.container')
        })
        $("#selected-variables").append(row(varData['pin_variable'], varData['tpe_variable'], varData['nme_variable']));
    }
}
//add variable to variables Array, pi and table
const addVariable = (pin, type) => {
    varData = {
        "pin_variable": pin,
        "tpe_variable": type,
        "nme_variable": ""
    };
    variables.push(varData);
    //disables droppable listener on 'pin'
    $(`#pin-${varData['pin_variable']}`).append(variable(varData['pin_variable'], varData['tpe_variable'])).droppable('disable');
    //enables draggable listener for deleting
    $(`#selected-${varData['pin_variable']}`).draggable()
    $(`#selected-${varData['pin_variable']}`).draggable({
        revert: "invalid",
        snap: ".delete-drop-zone",
        snapMode: "inner",
        snapTolerance: 50,
        containment: $('.container')
    })
    $("#selected-variables").append(row(varData['pin_variable'], varData['tpe_variable'], varData['nme_variable']));
    $(".table-input").on('input', function(event) {
        checkInput(this)
    });
}

//deletes variable from variables arrray, table and pi.
const deleteVariable = (pin) =>{
    $(`#row-${pin}`).remove();
    $(`#pin-${pin}`).droppable('enable')

    for(i = 0; i < variables.length; i++){
        value = variables[i]
        if(value['pin_variable']==pin){
            variables.splice(i, 1)
            break
        }
    }
}

//deletes all variables from variables array, table and pi.
const deleteAll = () =>{
    for(let i = 0; i < variables.length; i++){
        let pin = variables[i]['pin_variable']
        $(`#row-${pin}`).remove();
        $(`#selected-${pin}`).remove();
        $(`#pin-${pin}`).droppable('enable')
    }
    variables = [];
}

const showToast = (id) =>{
    $(id).toggleClass("show");
    setTimeout(function(){$(id).toggleClass("show");}, 3000);
}
//check if the critiria to send variables is valid and send them if it does.
//shows a toast message if not.
const sendVariables = () => {
    if(variables.length > 0){
        var values = [];
        let readyToSend = true;
        $('input[id^=input-]').each(function () {
            if ($.inArray(this.value, values) >= 0) {
                showToast("#no-repetition")
                readyToSend = false;
                return false; 
            }
            if(!varNameValidator.test(this.value)){
                showToast("#wrong-names");
                readyToSend = false;
                return false; 
            }
            variables.forEach(value=>{
                if(`input-${value['pin_variable']}`==$(this).attr('id'))
                    value['nme_variable'] = this.value;
            })
        values.push(this.value);
        });
        if(readyToSend){
            let fd = new FormData();
            let json = {
                "vars":variables,
            }
            let str_json = JSON.stringify(json)
            fd.append('variables',str_json);
            $.ajax({
                url: `/variables/set/${slug}`,
                data: fd,
                type: "POST",
                processData: false,
                contentType: false,
                success:(data)=>{
                    window.location.href = data;
                },
                error:(jqXHR, textStatus, errorThrown)=>{
                    console.log(errorThrown)  
                }
            })
        }
    }else{
       showToast("#no-variables")
    }
}
//(?=\S*[^0-9]*[a-z])[a-z_]+[^_\s]$
//[a-z][a-z]*(_[a-z0-9]+)*$
const varNameValidator = new RegExp('^[a-z][a-zA-Z0-9_]*(_[A-Z0-9]+)*$');
//check inputs for variable names
const checkInput = (input) =>{
    let result = varNameValidator.test($(input).val());
    if(!result){
        $(input).addClass('wrongVariableName');
    }else{
        $(input).removeClass('wrongVariableName');
    }
    return result;
}

//On document ready, get all variables.
$(document).ready((function () {
    path = window.location.pathname.split('/');
    slug = path[2];
    $.get('/variables/get/' + slug, (data) => {
        variables = data['variables'];
        console.log(variables)
        draw();
        $(".table-input").on('input', function(event) {
            checkInput(this)
        });
    })

}));

$(".element-output").draggable({
    helper: "clone",
    revert: "invalid",
    snap: ".output-pin-marker",
    snapMode: "inner",
    snapTolerance: 50,
    containment: $('.container')
});

$(".element-input").draggable({
    helper: "clone",
    revert: "invalid",
    snap: ".input-pin-marker",
    snapMode: "inner",
    snapTolerance: 50,
    containment: $('.container')
});

$("#pin-7, #pin-8").droppable({
    accept: ".element-input",
    activeClass: "accepted-variable",
    drop: function (event, ui) {
        $(this).droppable('disable');
        addVariable(parseInt($(this).attr('data-value')), $(ui.helper).attr('data-type'))
    }
});
$("#pin-1, #pin-2, #pin-3, #pin-4, #pin-5, #pin-6").droppable({
    accept: ".element-output",
    activeClass: "accepted-variable",
    drop: function (event, ui) {
        $(this).droppable('disable');
        addVariable(parseInt($(this).attr('data-value')), $(ui.helper).attr('data-type'))
    }
});
$(".delete-drop-zone").droppable({
    accept: ".selected-variable",
    activeClass: "delete-drop-zone-hover",
    drop: function (event, ui) {
        deleteVariable($(ui.helper).attr('data-value'));
        ui.draggable.remove();
    }
});