const output = (msg) =>{
    //Check for errors
    if (msg.includes("[Error]"))
        return `<span class="console-output console-error">${msg}</span>`
    else
        return `<span class="console-output"> > ${msg}</span>`
}

let socket

const run = () =>{
    $("#console").empty();
    $("#run-button").attr('disabled',true)
    $("#run-button").addClass('disabled')
    $("#stop-button").attr('disabled',false)
    $("#stop-button").removeClass('disabled')
    let namespace = '/run';
    console.log(namespace)
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
    socket.on('connect', function(e) {
        socket.emit('run', {data: slug});
        console.log(e)
    });
    socket.on('log', function(msg) {
        $('#console').append(output(msg.data));
    });
}

const stop = () =>{
   /*  $.ajax({
        url : '/code/kill',
        method: 'GET',
        success: (e) =>{
            console.log(e)
            $('#console').append(ouput(e))
        },
        error: (e)=>{
            console.log(e)
        }
    }) */
    try{
        socket.disconnect()
        $('#console').append("Programa Finalizado")
        $("#run-button").attr('disabled',false)
        $("#run-button").removeClass('disabled')
        $("#stop-button").attr('disabled',true)
        $("#stop-button").addClass('disabled')
    }catch{
        console.log('hee')
    }
}

const edit = () =>{
    stop()
    $("#console-modal").hide();
    $("#console").empty();
}