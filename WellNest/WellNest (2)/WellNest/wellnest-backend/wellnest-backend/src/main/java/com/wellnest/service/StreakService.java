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

    /**
     * ⭐ SMART STREAK UPDATE
     * - First activity → streak = 1
     * - Same day activity → ignore
     * - Next day activity → increment streak
     * - Older/backdated activity → ignore
     * - Gap > 1 day → reset streak
     */
    public void updateStreak(User user, LocalDate date) {

        LocalDate lastDate = user.getLastActivityDate();

        // First ever activity
        if (lastDate == null) {
            user.setCurrentStreak(1);
        }

        // Already logged today → do nothing
        else if (lastDate.equals(date)) {
            return;
        }

        // Consecutive day → increase streak
        else if (lastDate.plusDays(1).equals(date)) {
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        }

        // Backdated entry → don't break streak
        else if (date.isBefore(lastDate)) {
            return;
        }

        // Gap detected → reset streak
        else {
            user.setCurrentStreak(1);
        }

        user.setLastActivityDate(date);
        userRepository.save(user);

        badgeService.checkAndAwardBadges(user);
    }

    @Autowired
    private BadgeService badgeService;

    /**
     * ⭐ SHOW WHAT IS STORED IN DB
     * No visual reset here.
     */
    public int getCurrentVisibleStreak(User user) {

        if (user.getCurrentStreak() == null) {
            return 0;
        }

        return user.getCurrentStreak();
    }
}