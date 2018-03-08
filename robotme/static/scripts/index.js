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
        case "rocket":{
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
    return `<div class="project shadow" id="template">
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

//Radio selection for new project tag
$('.radio-group .radio').click(function () {
    $(this).parent().find('.radio').removeClass('selected');
    $(this).addClass('selected');
    var val = $(this).attr('data-value');
    $(this).parent().find('input').val(val);
});

window.onload = () =>{
    $.get(
        "/get_projects",
        (env)=>{
            console.log(env);
            $('#projects').html(env["projects"].map(template).join(''));
        }
    )
}