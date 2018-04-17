let textArea = document.getElementById('codemirror');
let previousContentTitle = new Array();

//array for variables
let variables;

//arrays for variable verification
let ledbuzzer_vars = new Array();
let servo_vars = new Array();
let motor_vars = new Array();
let interruption_vars = new Array();

//templates for parser.js
let importTemplate = new Array();
let exceptTemplate = new Array();

//Editor
let editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    autoClearEmptyLines: true,
    theme: "tomorrow-night-bright",
    indentUnit: 4,
});

//localStorage
let ls = window.localStorage;

//Slug
let slug
//Online SSE
let source;
let online = true;
//Autosave 
let autosave_timer = null;
let generation = null;

//template for rows
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


const draw = (variables) =>{
    for (let i = 0; i < variables.length; i++) {
        let varData = variables[i];
        $("#selected-variables").append(row(varData['pin_variable'], varData['tpe_variable'], varData['nme_variable']));
    }
}

$(document).ready(function () {
    path = window.location.pathname.split('/');
    slug = path[2];

    $.ajax({
        url: '/variables/get/' + slug,
        method: "GET",
        cache: false,
        success: (data) => {
            variables = data['variables'];
            draw(variables);
        },
        error: (data)=>{
            console.log(error)
        }
    })

    if(ls.getItem(slug)!=null){
        data = JSON.parse(ls.getItem(slug));
        codeSaved = data['data']
        editor.setValue(codeSaved)
        ls.removeItem(slug)
    }else{
        $.ajax({
            url: '/code/get/' + slug,
            method: "GET",
            cache: false,
            success: (data) => {
                editor.setValue(data);
                editor.clearHistory();
            },
            error: (data)=>{
                console.log(error)
            }
        })
    }
    $.ajax({
        url: '/code/import_template',
        method: "GET",
        cache: false,
        success: (data) => {
            importTemplate = data.split("\n")
        },
        error: (data)=>{
            console.log(error)
        }
    })

    $.ajax({
        url: '/code/except_template',
        method: "GET",
        cache: false,
        success: (data) => {
            exceptTemplate = data.split("\n")
        },
        error: (data)=>{
            console.log(error)
        }
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

    initWebsocket();
})

const saveOnRemote = () =>{
    let fd = new FormData();
    let file = new File([editor.getValue()],'pseudo.txt',{type: "text/plain"})
    fd.append('file',file)
    $.ajax({
        url: '/code/set/' + slug,
        data: fd,
        type: 'POST',
        contentType: false,
        processData: false, 
        success:(data)=>{
            console.log(data)
            lastSavedMsg()
            if(ls.getItem(slug)!=null){
                ls.removeItem(slug)
            }
        },
        error:(data)=>{
            console.log(data)  
        }
    })
}

const saveOnLocal = () =>{
    let data = {
        'data':editor.getValue()
    }
    ls.setItem(slug, JSON.stringify(data))
    lastSavedMsg()
}

const lastSavedMsg = () =>{
    date = new Date($.now())
    $('#last-saved').html(`Ultimo guardado: ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()+1}:${date.getMinutes()}`)
}

const initWebsocket = () =>{
    let tm;
    con = $('#connection-indicator')
    let socketConnection = io.connect(location.protocol + '//' + document.domain + ':' + location.port + '/connect');
    socketConnection.on('connect',(e)=>{
        online = true
        if(con.attr('class') !== 'connection-indicator'){
            con.attr('class','connection-indicator')
            con.empty()
            con.append(`<span>Conectado!</span>`)
            save();
        }
    })
    socketConnection.on('disconnect',(e)=>{
        online = false
            if(con.attr('class') !== 'connection-indicator disconnected'){
                con.attr('class','connection-indicator disconnected')
                con.empty()
                con.append(`<span>Desconectado!</span>`)
            }
    })
}

const save = () =>{
    if(online){
        saveOnRemote();
    }else{
        saveOnLocal();
    }
}

editor.on("change", function(cm, change) {
    if (autosave_timer) {
        autosave_timer = clearTimeout(autosave_timer);
    }
    // Initiate the timeout and wait for 5 seconds
    autosave_timer = setTimeout(function() {
        save()
    }, 5000);
})

const goToVariables = () =>{
    save();
    window.location.href = "/variables/" + slug;
}