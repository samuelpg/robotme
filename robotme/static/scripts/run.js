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
    let namespace = '/test';
    console.log(namespace)
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);
    socket.on('connect', function(e) {
        //socket.emit('my_event', {data: 'I\'m connected!'});
        console.log(e)
    });
    socket.on('log', function(msg) {
        $('#console').append(output(msg.data));
    });
}

const stop = () =>{
    socket.disconnect()
    $.ajax({
        url : '/code/kill',
        method: 'GET',
        success: (e) =>{
            console.log(e)
        },
        error: (e)=>{
            console.log(e)
        }
    })
}

const edit = () =>{
    stop()
    $("#console-modal").hide();
    $("#console").empty();
}