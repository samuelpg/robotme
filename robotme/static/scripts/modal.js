// Get the modal
var modal = document.getElementById('myModal');
var del = document.getElementById('deleteModal');
// Get the button that opens the modal
var btn = document.getElementById("myBtn");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks on the button, open the modal
btn.onclick = () => {
    modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
/*span.onclick = () => {
    modal.style.display = "none";
}*/
$('.close').click(()=>{
    cancel()
})
// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == modal || event.target == del) {
        cancel()
    }
}

const projectDeleteInfo = (color, icon, title, author) =>{
    return `
    <div class="center">
        <div id="icon" class="tag ${color}" style='margin: auto;'><img src="${icon}"></div>
        <h2 class="project-title">${title}</h2>
        <h3 class="project-author">Hecho por: ${author}</h3>
    </div>`
}
const openDeleteModal = (object) =>{
    $('#project_info').empty();
    $('#project_info').append(projectDeleteInfo(object.color, object.icon, object.title, object.author))
    $('body').data('del',object.slug);
    del.style.display = "block";
}

const deleteProject = () =>{
    slug = $('body').data('del');
    let fd = new FormData();
    fd.append('slug', slug);
    $.ajax({
        url: "/delete_project",
        data: fd,
        type: "DELETE",
        processData: false,
        contentType: false,
        success:(data)=>{
            $('#'+slug).remove();
            cancel();
        },
        error:(jqXHR, textStatus, errorThrown)=>{
            console.log(errorThrown)  
        }
    })
}
const cancel = ()=>{
    modal.style.display = "none";
    del.style.display = "none";
    document.getElementById("nme_project").value = '';
    document.getElementById("aut_project").value = '';
}
