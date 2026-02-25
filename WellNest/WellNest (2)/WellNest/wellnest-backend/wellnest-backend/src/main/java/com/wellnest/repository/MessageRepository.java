package com.wellnest.repository;

import com.wellnest.entity.Conversation;
import com.wellnest.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByConversation(Conversation conversation, Pageable pageable);
}
