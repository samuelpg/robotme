//constants
//ICONS
const robot_icon = "../static/assets/006-robot.svg";
const school_icon = "../static/assets/001-open-magazine.svg";
const idea_icon = "../static/assets/002-light-bulb.svg";
const rocket_icon = "../static/assets/003-rocket.svg";
const electricity_icon = "../static/assets/004-lightning-bolt.svg";
const game_icon = "../static/assets/005-console.svg";
//TEMPLATE
const template = ({nme_projects, aut_projects, dte_projects, slu_projects, tag_projects}) => {
    let icon = "";
    let color = "";
    switch(tag_projects){
        case "robot":{
            icon = robot_icon;
            color = "green";
            break;
        }
        case "school":{
            icon = school_icon;
            color = "orange";
            break;
        }
        case "idea":{
            icon = idea_icon;
            color = "pink";
            break;
        }
        case "science":{
            icon = rocket_icon;
            color = "purple";
            break;
        }
        case "electricity":{
            icon = electricity_icon;
            color = "blue";
            break;
        }
        case "game":{
            icon = game_icon;
            color = "teal";
            break;
        }
    }
    return `<div class="project shadow" id="${slu_projects}">
        <div id="icon" class="tag ${color}"><img src="${icon}"></div>
        <div class="project_text">
            <h2 class="project-title">${nme_projects}</h2>
            <h3 class="project-author">Hecho por: ${aut_projects}</h3>
            <span class="project-date pink-text">Ultima modificacion: ${dte_projects}</span>
        </div>
        <div class="project-buttons">
            <a href="/variables/${slu_projects}" class="project-button">Variables
                <i class="fa fa-chevron-right"></i>
            </a>
            <a href="/code/${slu_projects}" class="project-button">Ir al codigo
                <i class="fa fa-chevron-right"></i>
            </a>
        </div>
        <div class="trash-icon">
            <button onclick="openDeleteModal('${slu_projects}')" class="delete">
                <i class="fa fa-trash pink-text"></i>
            </button>
        </div>
    </div>
`
}

window.onload = () =>{
    $.get(
        "/get_projects",
        (env)=>{
            console.log(env);
            $('#projects').html(env["projects"].map(template).join(''));
        }
    )
    $('body').data('tag',"");
}

//Radio selection for new project tag
$('.radio-group .radio').click(function () {
    $(this).parent().find('.radio').removeClass('selected');
    $(this).addClass('selected');
    var val = $(this).attr('data-value');
    $('body').data('tag',val);
    removePopup("tagErrorPopup");
});

const showPopup = (id) =>{
    var popup = document.getElementById(id);
    popup.className = "popuptext show";
}

const removePopup = (id) =>{
    console.log("X")
    var popup = document.getElementById(id);
    popup.className = "popuptext";
}

$("#nme_project").change(()=>{removePopup("nameErrorPopup")});
$("#aut_project").change(()=>{removePopup("authorErrorPopup")});

const postNewProject = () =>{
    console.log("A")
    let name = $('#nme_project').val();
    let author = $('#aut_project').val();
    let tag =  $('body').data('tag');
    let error = false;
    if(name == ""){
        showPopup("nameErrorPopup");
        error = true;
    }
    if(author == ""){
        showPopup("authorErrorPopup");
        error = true;
    }
    console.log(tag)
    if(tag == ""){
        showPopup("tagErrorPopup");
        error = true;
    }
    if(!error){
        let fd = new FormData();
        fd.append('name', name)
        fd.append('author', author)
        fd.append('tag', tag)
        console.log("AB")
        $.ajax({
            url: "/new",
            data: fd,
            type: "POST",
            processData: false,
            contentType: false,
            success:(data)=>{
                window.location.href=data
            },
            error:(jqXHR, textStatus, errorThrown)=>{
                console.log(errorThrown)  
            }
        })
    }
}