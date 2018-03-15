let textArea = document.getElementById('codemirror');

let previousContentTitle = new Array();
let variables
let ledbuzzer_vars = new Array();
let servo_vars = new Array();
let motor_vars = new Array();
let interruption_vars = new Array();

let editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    autoClearEmptyLines: true,
    theme: "tomorrow-night-bright",
    indentUnit: 4,
});

let slug;

const row = (pin, type, name) =>{
    let color = "";
    switch (type) {
        case "servo":
            {
                color = "purple";
                servo_vars.push(name);
                break;
            }
        case "dc":
            {
                color = "teal";
                motor_vars.push(name);
                break;
            }
        case "led":
            {
                color = "green";
                ledbuzzer_vars.push(name);
                break;
            }
        case "buzzer":
            {
                color = "blue";
                ledbuzzer_vars.push(name);
                break;
            }
        case "button":
            {
                color = "pink";
                interruption_vars.push(name);
                break;
            }
        case "pir":
            {
                color = "orange";
                interruption_vars.push(name);
                break;
            }
    }
    return `<tr id="row-${pin}" class="table-selected-row">
        <td>
            <div class="mini-element ${color}">${pin}</div>
        </td>
        <td class="td-grey">
            ${type}
        </td>
        <td class="td-grey">
            ${name}
        </td>
    </tr>`
}
const save = () =>{
    let fd = new FormData();
    let file = new File([editor.getValue()],'pseudo.txt',{type: "text/plain"})
    fd.append('file',file)
    $.ajax({
        url: '/code/'+slug+'/set',
        data: fd,
        type: 'POST',
        contentType: false,
        processData: false, 
        success:(data)=>{
            console.log(data)
        },
        error:(data)=>{
            console.log(data)
        }
    })
}

const draw = (variables) =>{
    for (let i = 0; i < variables.length; i++) {
        let varData = variables[i];
        $("#selected-variables").append(row(varData['pin_variable'], varData['tpe_variable'], varData['nme_variable']));
    }
}

$(document).ready(function () {
    path = window.location.pathname.split('/');
    slug = path[2];
    $.get('/variables/get/' + slug, (data) => {
        variables = data['variables'];
        draw(variables);
    })
    console.log(editor.getValue())
    $.get('/code/' + slug + '/get', (data) => {
        editor.setValue(data);
        editor.clearHistory();
    })
    $('#accordion').find('.accordion-toggle').click(function () {
        //Expand or collapse this panel
        $(this).next().slideToggle('fast');
        $(this).find("i").toggleClass('fa-chevron-down');
        previousContentTitle.splice(0,0,$(this));
        //Hide the other panels
        $(".accordion-content").not($(this).next()).slideUp('fast');
        if(previousContentTitle.length > 1){
            previousContentTitle[1].find("i").toggleClass('fa-chevron-down');
            previousContentTitle.pop(1);
        }
    });

    let eventSource = new EventSource("/connected");
    eventSource.onmessage = function (e) {
        console.log(e);
    };
})

const goBack = () =>{
    editor.undo();
}