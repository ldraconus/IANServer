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
    msg Message
    conn *websocket.Conn
}

var clients = make(map[*websocket.Conn] bool) // connected clients
var broadcast = make(chan Packet)          // broadcast channel

var teacher *websocket.Conn = nil;

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

func handleConnections(w http.ResponseWriter, r *http.Request) {
    // Upgrade initial GET request to a websocket
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Fatal(err)
    }

    // Make sure we close the connection when the function returns
    defer ws.Close()

    // Register our new client
    clients[ws] = true

    for {
       var msg Message
       var pkt Packet

       // Read in a new message as JSON and map it to a Message object
       err := ws.ReadJSON(&msg)
log.Printf("msg: {\n");
log.Printf("   \"name\": \"" + msg.Name + "\",\n");
log.Printf("   \"type\": \"" + msg.Type + "\",\n");
log.Printf("   \"msg\": \"" + msg.Message + "\"\n");
log.Printf("}\n");
       pkt.msg = msg;
       pkt.conn = ws;
       if err != nil {
          log.Printf("error: %v", err)
          delete(clients, ws)
          break
       }
       // Send the newly received message to the broadcast channel
       broadcast <- pkt
    }
}

func handleMessages() {
    for {
    	var msg Message
    	var pkt Packet

        // Grab the next message from the broadcast channel
	pkt = <-broadcast
        msg = pkt.msg

	if msg.Type == "LOGIN" {
	   if ValidLogin(msg.Name, msg.Message) {
	      teach := 0
	      if IsTeacher(msg.Name) {
	         teach = 1;
		 teacher = pkt.conn;
    	      }
	      var toSend Message
	      if teach == 1 {
	         toSend.Type = "TEACHER"
	      } else {
	         toSend.Type = "STUDENT"
	      }
	      err := pkt.conn.WriteJSON(toSend)
	      if err != nil {
	         log.Printf("error: %v", err)
	         delete(clients, pkt.conn)
	         return
	      }
	   } else {
	      var toSend Message
	      toSend.Type = "INVALID"
	      err := pkt.conn.WriteJSON(toSend)
	      if err != nil {
	         log.Printf("error: %v", err)
	         delete(clients, pkt.conn)
	         return
	      }
	   }
       } else {
	  if teacher == nil {
	     return;
	  }
	  err := teacher.WriteJSON(msg)
	  if err != nil {
	     log.Printf("error: %v", err)
	     teacher.Close()
	     delete(clients, teacher)
	  }
       }
    }
}
