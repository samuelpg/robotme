const tutorial = $("#tutorial-modal")
let pages = $(".carousell-page");
let current

const openTutorial = () =>{
    current = 0;
    pages[current].style = "display: block"
    checkButtons();
    tutorial.show();
}

const closeTutorial = () =>{
    tutorial.hide();
}

const next = () =>{
    pages[current].style = "display: none"
    current += 1;
    pages[current].style = "display: block"
    checkButtons();
}

const back = () =>{
    pages[current].style = "display: none"
    current -= 1;
    pages[current].style = "display: block"
    checkButtons();
}

const checkButtons = () =>{
    console.log("a")
    if(current == 0){
        console.log("a")
        $("#back").attr('disabled', true);
        $("#back").addClass('disabled');
    }else if(current == pages.length - 1){
        $("#next").attr('disabled', true);
        $("#next").addClass('disabled');
    }else{
        $("#back").attr('disabled', false);
        $("#back").removeClass('disabled')
        $("#next").attr('disabled', false);
        $("#next").removeClass('disabled');
    }
}