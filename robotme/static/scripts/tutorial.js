const tutorial = $("#tutorial-modal");
const currentPageText = $("#carousell-current");
let pages = $(".carousell-page");
let current
let lstutorial = window.localStorage

window.onload = () =>{
    let path = window.location.pathname.split('/');
    let page = path[1];
    let seen = lstutorial.getItem('seen_'+page)
    if(seen == null || !seen){
        openTutorial()
        lstutorial.setItem('seen_'+page, true)
    }
}

const openTutorial = () =>{
    current = 0;
    pages[current].style = "display: block"
    currentPageText.html(`${current+1}/${pages.length}`)
    checkButtons();
    tutorial.show();
}

const closeTutorial = () =>{
    pages[current].style = "display: none";
    checkButtons();
    tutorial.hide();
}

const next = () =>{
    pages[current].style = "display: none"
    current += 1;
    pages[current].style = "display: block"
    currentPageText.html(`${current+1}/${pages.length}`)
    checkButtons();
}

const back = () =>{
    pages[current].style = "display: none"
    current -= 1;
    pages[current].style = "display: block"
    currentPageText.html(`${current+1}/${pages.length}`)
    checkButtons();
}

const checkButtons = () =>{
    if(current == 0){
        $("#back").attr('disabled', true);
        $("#back").addClass('disabled');
        $("#next").attr('disabled', false);
        $("#next").removeClass('disabled');
    }else if(current == pages.length - 1){
        $("#next").attr('disabled', true);
        $("#next").addClass('disabled');
        $("#back").attr('disabled', false);
        $("#back").removeClass('disabled')
    }else{
        $("#back").attr('disabled', false);
        $("#back").removeClass('disabled')
        $("#next").attr('disabled', false);
        $("#next").removeClass('disabled');
    }
}