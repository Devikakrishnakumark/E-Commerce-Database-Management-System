document.querySelectorAll(".remove-btn").forEach(function(button){

button.addEventListener("click",function(){

this.closest("tr").remove();

alert("Product removed from cart.");

});

});