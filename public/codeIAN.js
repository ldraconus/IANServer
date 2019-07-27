//Global Variables
let ws = null;
var message = { name: "", type: "LOGIN", msg: "" };
var log = true;
var stud = false;
var teach = false;

function updateStudent(msg)
{
  //to add later if we want sending msg
}

function updateLog(msg)
{
   let data = JSON.parse(msg.data);
alert(data.type);
   if(data.type == "TEACHER")
   {
     log = false;
     teach = true;
     showTeacher();
   }
   else if(data.type == "STUDENT")
   {
     log = false;
     student = true;
     showStudent();
   }
}

// Update chat-panel and list of connected users
function updateTeacher(msg) {
    var sp = "&nbsp&nbsp&nbsp&nbsp";
    let data = JSON.parse(msg.data);
    id("chat").insertAdjacentHTML("afterbegin", data.msg);

    $(document).ready(function () {
        $('button').click(function () {
     	   $('#todo').append("<li>" + data.name + sp + data.msg + sp + data.type + "<a href='#' id='close'>delete</a></li>");
        });

        $("body").on('click', 'li', function () {
            $(this).closest("li").remove();
   	});
    });
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

//Establish the WebSocket connection and set up event handlers
ws = new WebSocket('ws://' + window.location.host + '/ws');
ws.onmessage = msg => updateChat(msg);
ws.onclose = () => alert("WebSocket connection closed");

function login()
{
  var name = document.getElementById("name").value;
  var pass = document.getElementById("password").value;
  message.name = name;
  message.msg = pass;
  message.type = "LOGIN";
  var json = JSON.stringify(message);
  ws.send(json);
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

var once = false;

function showLogin()
{
  if (once) return;
  once = true;
  document.getElementById("login").style.display = "block";
  document.getElementById("student").style.display = "none";
  document.getElementById("teacher").style.display = "none";
}

function showStudent()
{
  document.getElementById("login").style.display = "none";
  document.getElementById("student").style.display = "block";
  document.getElementById("teacher").style.display = "none";
}

function showTeacher()
{
  document.getElementById("login").style.display = "none";
  document.getElementById("student").style.display = "none";
  document.getElementById("teacher").style.display = "block";
}
