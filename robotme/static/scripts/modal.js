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
    modal.style.display = "none";
    del.style.display = "none";
    document.getElementById("nme_project").value = '';
    document.getElementById("aut_project").value = '';
})
// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == modal || event.target == del) {
        modal.style.display = "none";
        del.style.display = "none";
        document.getElementById("nme_project").value = '';
        document.getElementById("aut_project").value = '';
    }
}

let openDeleteModal = (slug) =>{
    console.log(slug)
    del.style.display = "block";
}