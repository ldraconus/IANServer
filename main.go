package main

import (
    "log"
    "net/http"

    "github.com/gorilla/websocket"
)

// Define our message object
type Message struct {
    Type     string `json:"type"`
    Name     string `json:"name"`
    Message  string `json:"msg"`
}
type Packet struct {
    Msg Message
    Id  int
}

var broadcast = make(chan Packet)          // message channel
var clients = make(map[*websocket.Conn]int)
var teacher = -1

// configure the upgrader
var upgrader = websocket.Upgrader{}


func main() {
    // Initialize the DB
    InitDB()

    // Create a simple file server
    fs := http.FileServer(http.Dir("../public"))
    http.Handle("/", fs)

    // Configure websocket route
    http.HandleFunc("/ws", handleConnections)

    // Start listening for incoming chat messages
    go handleMessages()

    log.Println("http server started on :8181")
    err := http.ListenAndServe(":8181", nil)
    if err != nil {
        log.Fatal("ListenAndServer: ", err) 	
    }
}

func findIndex() int {
    max := -1
    for _, id := range clients {
        if id > max {
            max = id
        }
    }
    return max + 1
}

func SendMessage(msg Message, who int) {
    for client, id := range clients {
        if id == who {
log.Printf("Sending message ...\n")
            err := client.WriteJSON(msg)
            if err != nil {
                log.Printf("write error: %v", err)
            }
            return
        }
    }
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
    // Upgrade initial GET request to a websocket
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Fatal(err)
    }

    // Make sure we close the connection when the function returns
    defer ws.Close()

    var msg Message
    var pack Packet

    pack.Id = findIndex()
    clients[ws] = pack.Id

    for {
        // Read in a new message as JSON and map it to a Message object
        err := ws.ReadJSON(&msg)
        if err != nil {
            log.Printf("read error: %v", err)
            break
        }

        pack.Msg = msg

        // Send the newly received message to the broadcast channel
log.Printf("msg: {\n")
log.Printf("   \"name\": \"" + msg.Name + "\",\n")
log.Printf("   \"type\": \"" + msg.Type + "\",\n")
log.Printf("   \"msg\": \"" + msg.Message + "\"\n")
log.Printf("}\n")
        broadcast <- pack
    }
}

func writeMessage(msg Message, id int) {
    if msg.Type == "TEACHER" {
        teacher = id
        SendMessage(msg, id)
    } else if msg.Type == "STUDENT" {
        SendMessage(msg, id)
    } else if msg.Type == "INVALID" {
        SendMessage(msg, id)
    } else {
        if teacher != -1 {
            SendMessage(msg, teacher)
log.Printf("Message sent to Teacher\n")
        } else {
log.Printf("Teacher not logged in, message dropped\n")
        }
    }
}

func handleMessages() {
    for {
    	var msg Message
        var pack Packet

        // Grab the next message from the broadcast channel
	pack = <-broadcast
	msg = pack.Msg
	id := pack.Id
log.Printf("msg: {\n")
log.Printf("   \"name\": \"" + msg.Name + "\",\n")
log.Printf("   \"type\": \"" + msg.Type + "\",\n")
log.Printf("   \"msg\": \"" + msg.Message + "\"\n")
log.Printf("}\n")
log.Printf("id: %d\n", id)

	if msg.Type == "LOGIN" {
	    var toSend Message
	    if ValidLogin(msg.Name, msg.Message) {
log.Printf("Login is valid.\n")
	        teach := 0
	        if IsTeacher(msg.Name) {
log.Printf("Teacher has logged on\n")
	            teach = 1
    	        }
	        if teach == 1 {
	            toSend.Type = "TEACHER"
	        } else {
log.Printf("Student has logged on\n")
	            toSend.Type = "STUDENT"
	        }
log.Printf("toSend: {\n")
log.Printf("   \"name\": \"" + toSend.Name + "\",\n")
log.Printf("   \"type\": \"" + toSend.Type + "\",\n")
log.Printf("   \"msg\": \"" + toSend.Message + "\"\n")
log.Printf("}\n")
	   } else {
log.Printf("Invalid login detected\n")
	      toSend.Type = "INVALID"
	   }
           writeMessage(toSend, id)
       } else {
	   writeMessage(msg, id)
       }
    }
}
