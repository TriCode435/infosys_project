package com.wellnest.service;

import com.wellnest.entity.Badge;
import com.wellnest.entity.User;
import com.wellnest.repository.BadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    public void checkAndAwardBadges(User user) {
        int streak = user.getCurrentStreak() != null ? user.getCurrentStreak() : 0;

        if (streak >= 7 && !badgeRepository.existsByUserAndName(user, "7 Day Streak!")) {
            awardBadge(user, "7 Day Streak!", "award", "Logged activity for 7 consecutive days.");
        }

        if (streak >= 30 && !badgeRepository.existsByUserAndName(user, "Monthly Master")) {
            awardBadge(user, "Monthly Master", "star", "Logged activity for 30 consecutive days.");
        }
    }

    private void awardBadge(User user, String name, String icon, String desc) {
        Badge badge = Badge.builder()
                .name(name)
                .icon(icon)
                .description(desc)
                .user(user)
                .build();
        badgeRepository.save(badge);
    }

    public List<Badge> getBadges(User user) {
        return badgeRepository.findByUser(user);
    }
}
