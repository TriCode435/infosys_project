package com.wellnest.service;

import com.wellnest.dto.ConversationDTO;
import com.wellnest.dto.MessageDTO;
import com.wellnest.entity.Conversation;
import com.wellnest.entity.Message;
import com.wellnest.entity.MessageType;
import com.wellnest.entity.User;
import com.wellnest.repository.ConversationRepository;
import com.wellnest.repository.MessageRepository;
import com.wellnest.repository.UserRepository;
import com.wellnest.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public ConversationDTO getOrCreateConversation(Long userId, Long trainerId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new EntityNotFoundException("Trainer not found"));

        // Validate if they have an active or past booking
        // This is a simplified check. A more robust check would involve
        // BookingRepository.
        // For now, we assume if they are asking for it, they might have one or we'll
        // enforce it in Controller.

        Optional<Conversation> existing = conversationRepository.findByUserAndTrainer(user, trainer);
        if (existing.isPresent()) {
            return convertToConversationDTO(existing.get());
        }

        Conversation conversation = Conversation.builder()
                .user(user)
                .trainer(trainer)
                .build();

        return convertToConversationDTO(conversationRepository.save(conversation));
    }

    @Transactional
    public MessageDTO saveMessage(MessageDTO dto) {
        Conversation conversation = conversationRepository.findById(dto.getConversationId())
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new EntityNotFoundException("Sender not found"));

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .messageContent(dto.getMessageContent())
                .messageType(dto.getMessageType() != null ? dto.getMessageType() : MessageType.TEXT)
                .isRead(false)
                .build();

        return convertToMessageDTO(messageRepository.save(message));
    }

    public Page<MessageDTO> getChatHistory(Long conversationId, Pageable pageable) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));
        return messageRepository.findByConversation(conversation, pageable).map(this::convertToMessageDTO);
    }

    public List<ConversationDTO> getUserConversations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return conversationRepository.findByUserOrTrainer(user, user).stream()
                .map(this::convertToConversationDTO)
                .collect(Collectors.toList());
    }

    private ConversationDTO convertToConversationDTO(Conversation conversation) {
        return ConversationDTO.builder()
                .id(conversation.getId())
                .userId(conversation.getUser().getId())
                .userName(conversation.getUser().getUsername())
                .trainerId(conversation.getTrainer().getId())
                .trainerName(conversation.getTrainer().getUsername())
                .createdAt(conversation.getCreatedAt())
                .build();
    }

    private MessageDTO convertToMessageDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getUsername())
                .messageContent(message.getMessageContent())
                .messageType(message.getMessageType())
                .isRead(message.isRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
