/**
 * [ws Initial Global Variables]
 * @type {[boolean, object, JSON]}
 */
let ws = null;
var message = { name: "", type: "LOGIN", msg: "" };
var log = true;
var stud = false;
var teach = false;
var stylesheetLog = null;
var once = false;

/**
 * UPDATE LOG
 * [This calls the correct functions to show
 * Appropriate screen for the correct user Profile]
 * @param  {[JSON]} msg [Gets Parsed into a string]
 */
function updateLog(msg)
{
   let data = JSON.parse(msg.data);
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
   else if (data.type == "INVALID") 
   {
     // show login error on login div
   }
}

/**
 * UPDATE STUDENT
 * [to add later if we want sending msg]
 * @param  {[JSON]} msg [Gets Parsed into a string]
 *
 */
function updateStudent(msg)
{
  //to add later if we want sending msg
}

/**
 * UPDATE TEACHER
 * [ Update chat-panel and list of connected users]
 * @param  {[JSON]} msg [Gets Parsed into a string]
 */
function updateTeacher(msg) {
    var sp = "&nbsp&nbsp&nbsp&nbsp";
    let data = JSON.parse(msg.data);
    $('#todo').append("<li>" + data.name + sp + data.msg + sp + data.type + "<a href='#' id='close'>delete</a></li>");

}

/**
 * UPDATE CHAT
 * [Checks Golbal variables and will call the correct
 * Update function based on user profile]
 * @param  {[JSON]} msg [Gets Parsed into a string]
 */
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

/**
 * Second Set Global Variables
 *[ Establish the WebSocket connection and set up event handlers]
 * @type {WebSocket}
 */
ws = new WebSocket('ws://' + window.location.host + '/ws');
ws.onmessage = msg => updateChat(msg);
ws.onclose = () => alert("WebSocket connection closed");

/**
 * LOGIN
 * [Grabs the correct values out of the text fields (name, password
 * ) then adds them to the JSON object and sed it off]
 * @return {[JSON]} [login fields: name, pass, type]
 */
function login()
{
  //Disable Collins CSS, its messing up my radio buttons
  stylesheetLog = document.styleSheets[1];
  console.log(stylesheetLog);
  stylesheetLog.disabled = true;
  
  var name = document.getElementById("name").value;
  var pass = document.getElementById("password").value;
  message.name = name;
  message.msg = pass;
  message.type = "LOGIN";
  var json = JSON.stringify(message);
  ws.send(json);
}

/**
 * GET INFO
 * [This gets the info from the students help ticket
 * Creates JSON Object after submit on Student side]
 * @return {[JSON]} [Students fix it ticket]
 */
function getInfo()
{
  var radioValue = 0;
}


/**
 * SHOW LOGIN
 * [Reveals login page. Is called body onload, the first thing
 * the user sees to login. ]
 */
function showLogin()
{
  if (once) return;
  once = true;
  document.getElementById("login").style.display = "block";
  document.getElementById("student").style.display = "none";
  document.getElementById("teacher").style.display = "none";
}

/**
 * SHOW STUDENT
 * [Reveals Student page. Is called by updateChat()
 * Necessary to keep one-page application]
 */
function showStudent()
{
  document.getElementById("login").style.display = "none";
  document.getElementById("student").style.display = "block";
  document.getElementById("teacher").style.display = "none";
       $("input[type='button']").click(function(){
            var name = document.getElementById("secret").value;
            var msg = document.getElementById("message").value;
            radioValue = $("input[name='rate1']:checked").val();
            //Here are the 3 values, they just need to be
            //added to the JSON object
            message.name = name;
            message.msg = msg;
            message.type = radioValue + "";
            var json = JSON.stringify(message);
            ws.send(json);
            document.getElementById("message").value = "";
       });
}

/**
 * SHOW TEACHER
 * [Reveals Teacher page. Is called by updateChat()
 * Necessary to keep one-page application]
 */
function showTeacher()
{
  document.getElementById("login").style.display = "none";
  document.getElementById("student").style.display = "none";
  document.getElementById("teacher").style.display = "block";
    $(document).ready(function () {
  	  $("body").on('click', 'li', function () {
      	  $(this).closest("li").remove();
   	  });
     });
}
