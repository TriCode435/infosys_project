package com.wellnest.repository;

import com.wellnest.entity.Conversation;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByUserAndTrainer(User user, User trainer);

    List<Conversation> findByUserOrTrainer(User user, User trainer);
}
