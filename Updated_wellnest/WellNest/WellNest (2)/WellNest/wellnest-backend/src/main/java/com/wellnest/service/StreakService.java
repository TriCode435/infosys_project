package com.wellnest.service;

import com.wellnest.entity.User;
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
@Transactional
public class StreakService {

    @Autowired
    private UserRepository userRepository;

    public void updateStreak(User user, LocalDate date) {
        if (user.getLastActivityDate() == null) {
            user.setCurrentStreak(1);
        } else if (user.getLastActivityDate().equals(date.minusDays(1))) {
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        } else if (user.getLastActivityDate().equals(date)) {
            return; // Already active today
        } else {
            user.setCurrentStreak(1);
        }
        user.setLastActivityDate(date);
        userRepository.save(java.util.Objects.requireNonNull(user));
    }

    public int getCurrentVisibleStreak(User user) {
        if (user.getLastActivityDate() == null)
            return 0;

        // If last activity was before yesterday, streak is reset to 0
        if (user.getLastActivityDate().isBefore(LocalDate.now().minusDays(1))) {
            return 0;
        }
        return user.getCurrentStreak();
    }
}
