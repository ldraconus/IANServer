
// small helper function for selecting element by id
//let id = id => document.getElementById(id);

//Global Variables
let ws = null;
var message = { name: "", type: "TEACHER", msg: "" };
var log = true;
var stud = false;
var teach = false;
var stylesheetLog = null;

function login()
{
  //Disable Collins CSS, its messing up my radio buttons
  stylesheetLog = document.styleSheets[1];
  console.log(stylesheetLog);
  stylesheetLog.disabled = true;
	
  //Establish the WebSocket connection and set up event handlers
  ws = new WebSocket('ws://' + window.location.host + '/ws');
  ws.onmessage = msg => updateChat(msg);
  ws.onclose = () => alert("WebSocket connection closed");
  var name = document.getElementById("name").value;
  var pass = document.getElementById("password").value;
  message.name = name;
  message.msg = pass;
  message.type = "LOGIN";
  var json = JSON.stringify(message);
  ws.send(json);
}



function updateChat(msg) {
  if( log )
  {
    updateLog(msg);
  }
  else if( stud )
  {
    updateStudent(msg);
  }
  else if( teach )
  {
    updateTeacher(msg);
  }
}

function updateStudent(msg)
{
  //to add later if we want sending msg
}

function updateLog(msg)
{
   let data = JSON.parse(msg.data);
   if(data.Type == "TEACHER")
   {
     log = false;
     teach = true;
     showTeacher();
   }
   else if(data.Type == "STUDENT")
   {
     log = false;
     teach = true;
     showStudent();
   }
}

// Update chat-panel and list of connected users
function updateTeacher(msg) {
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

//Creates JSON Object after submit on Student side
function getInfo()
{
  var name = document.getElementById("name").value;
  var msg = document.getElementById("message").value;
  var radioValue = 0;

  $(document).ready(function(){
       $("input[type='button']").click(function(){
            radioValue = $("input[name='rate1']:checked").val();
            //alert(name + " " + msg + " " + radioValue);
            //Here are the 3 values, they just need to be
            //added to the JSON object
            message.name = name;
            message.msg = msg;
            message.type = radioValue + "";
            var json = JSON.stringify(message);
            ws.send(json);
       });
   });

}

function showLogin()
{
  document.getElementById("login").hidden = false;
  document.getElementById("student").hidden = true;
  document.getElementById("teacher").hidden = true;
}

function showStudent()
{
  document.getElementById("login").hidden = true;
  document.getElementById("student").hidden = false;
  document.getElementById("teacher").hidden = true;
}

function showTeacher()
{
  document.getElementById("login").hidden = true;
  document.getElementById("student").hidden = true;
  document.getElementById("teacher").hidden = false;
}
