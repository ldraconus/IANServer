// small helper function for selecting element by id
let id = id => document.getElementById(id);

//Establish the WebSocket connection and set up event handlers
let ws = new WebSocket('ws://' + window.location.host + '/ws');
ws.onmessage = msg => updateChat(msg);
ws.onclose = () => alert("WebSocket connection closed");

// Add event listeners to button and input field
id("send").addEventListener("click", () => sendAndClear(id("message").value));
id("message").addEventListener("keypress", function (e) {
    if (e.keyCode === 13) { // Send message if enter is pressed in input field
        sendAndClear(e.target.value);
    }
});

var message = { name: "", type: "TEACHER", msg: "" };

function sendAndClear(msg) {
    if (msg !== "") {
	message["msg"] = msg;
	message["name"] = id("name").value;
	var json = JSON.stringify(message);
        ws.send(json);
        id("message").value = "";
    }
}

function updateChat(msg) { // Update chat-panel and list of connected users
	var sp = "&nbsp&nbsp&nbsp&nbsp";
    let data = JSON.parse(msg.data);
    id("chat").insertAdjacentHTML("afterbegin", data.msg);
   //    id("userlist").innerHTML = data.userlist.map(user => "<li>" + user + "</li>").join("");
	  
  
  	$(document).ready(function () {
   	 $('button').click(function () {
     	   $('#todo').append("<li>" + data.name + sp + data.msg + sp + data.type + "<a href='#' id='close'>delete</a></li>");
   	 });

  	  $("body").on('click', 'li', function () {
      	  $(this).closest("li").remove();
   	 });
     });
}
