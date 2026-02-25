package com.wellnest.controller;

import com.wellnest.dto.ConversationDTO;
import com.wellnest.dto.MessageDTO;
import com.wellnest.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<ConversationDTO>> getUserConversations(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getUserConversations(userId));
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationDTO> getOrCreateConversation(@RequestParam Long userId,
            @RequestParam Long trainerId) {
        return ResponseEntity.ok(chatService.getOrCreateConversation(userId, trainerId));
    }

    @GetMapping("/history/{conversationId}")
    public ResponseEntity<Page<MessageDTO>> getChatHistory(@PathVariable Long conversationId, Pageable pageable) {
        return ResponseEntity.ok(chatService.getChatHistory(conversationId, pageable));
    }

    @MessageMapping("/send-message")
    public void processMessage(@Payload MessageDTO messageDTO) {
        MessageDTO saved = chatService.saveMessage(messageDTO);
        // Send message to both participants using their userIds as topics or specific
        // conversation topic
        messagingTemplate.convertAndSend("/topic/messages/" + messageDTO.getConversationId(), saved);
    }
}
