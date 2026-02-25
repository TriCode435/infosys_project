package com.wellnest.controller;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WeeklyLockScheduler {

    @Scheduled(cron = "0 0 0 * * MON") // Every Monday midnight
    public void lockOldWeeks() {

        // List<WeeklyPlan> oldPlans =
        // weeklyPlanRepo.findByWeekStartDateBefore(LocalDate.now());

        // oldPlans.forEach(plan -> plan.setLocked(true));

        // weeklyPlanRepo.saveAll(oldPlans);
    }
}
