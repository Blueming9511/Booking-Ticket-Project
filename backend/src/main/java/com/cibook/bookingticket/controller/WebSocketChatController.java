package com.cibook.bookingticket.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketChatController {

    @MessageMapping("/chat") // Khớp với "/app/chat"
    @SendTo("/topic/messages")
    public OutputMessage send(Message message) {
        return new OutputMessage(message.getContent());
    }

    public static class Message {
        private String content;
        // getters + setters
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class OutputMessage {
        private String content;
        public OutputMessage(String content) { this.content = content; }
        public String getContent() { return content; }
    }
}
