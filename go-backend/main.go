package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type Reminder struct {
    Plant   string json:"plant"
    DueDate string json:"dueDate"
}

func enableCORS(w http.ResponseWriter) {
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
}

func remindersHandler(w http.ResponseWriter, r *http.Request) {
    enableCORS(w)
    
    if r.Method == "OPTIONS" {
        w.WriteHeader(http.StatusOK)
        return
    }
    
    reminders := []Reminder{
        {Plant: "Monstera", DueDate: "2026-04-14"},
        {Plant: "Cactus", DueDate: "2026-04-20"},
        {Plant: "Snake Plant", DueDate: "2026-04-18"},
    }
    
    json.NewEncoder(w).Encode(reminders)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
    enableCORS(w)
    w.Write([]byte({"status": "ok"}))
}

func main() {
    http.HandleFunc("/api/watering/reminders", remindersHandler)
    http.HandleFunc("/api/health", healthHandler)
    
    fmt.Println("Go backend running on port 8080")
    fmt.Println("Visit: http://localhost:8080/api/watering/reminders")
    http.ListenAndServe(":8080", nil)
}