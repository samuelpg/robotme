const output = (msg) =>{
    //Check for errors
    if (msg.includes("[Error]"))
        return `<span class="console-output console-error">${msg}</span>`
    else
        return `<span class="console-output"> > ${msg}</span>`
}

const updateScroll = () =>{
    let element = document.getElementById("console");
    element.scrollTop = element.scrollHeight;
}

let socket

const run = () =>{
    $("#console").empty();
    $("#run-button").attr('disabled',true)
    $("#run-button").addClass('disabled')
    $("#stop-button").attr('disabled',false)
    $("#stop-button").removeClass('disabled')
    let namespace = '/run';
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
    socket.on('connect', function(e) {
        socket.emit('run', {data: slug});
    });
    socket.on('log', function(msg) {
        $('#console').append(output(msg.data));
        updateScroll()
    });
}

const stop = () =>{
    try{
        socket.disconnect()
        $('#console').append(output("Programa Finalizado"))
        $("#run-button").attr('disabled',false)
        $("#run-button").removeClass('disabled')
        $("#stop-button").attr('disabled',true)
        $("#stop-button").addClass('disabled')
    }catch{
        console.log("Error disconnecting socket")
    }
}

const edit = () =>{
    stop()
    $("#console-modal").hide();
    $("#console").empty();
}