let textArea = document.getElementById('codemirror');
let editor = CodeMirror.fromTextArea(textArea, {
    lineNumbers: true,
    autoClearEmptyLines: true,
    theme: "tomorrow-night-bright",
    indentUnit: 4,
});

let slug;

const save = () =>{
    let fd = new FormData();
    console.log(editor.getValue())
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

const run = () =>{

}

const checker = () =>{
    
}

$(document).ready(function () {
    path = window.location.pathname.split('/');
    slug = path[2];
    $.get('/code/' + slug + '/get', (data) => {
        editor.setValue(data)
    })
    $('#accordion').find('.accordion-toggle').click(function () {

        //Expand or collapse this panel
        $(this).next().slideToggle('fast');
        $(this).find("i").toggleClass('fa-chevron-down')

        //Hide the other panels
        $(".accordion-content").not($(this).next()).slideUp('fast')
        $(".accordion-content").not($(this)).find("i").removeClass("fa-chevron-down");
    });

    let eventSource = new EventSource("/connected");
    eventSource.onmessage = function (e) {
        console.log(e)
    };
})
