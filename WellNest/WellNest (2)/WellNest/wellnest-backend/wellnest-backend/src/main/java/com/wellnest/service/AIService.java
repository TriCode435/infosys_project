package com.wellnest.service;

import com.wellnest.dto.NutritionDetailsDTO;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class AIService {

    public List<String> getSmartInsights(NutritionDetailsDTO nutrition) {
        List<String> insights = new ArrayList<>();

        if (nutrition.getProteinConsumed() < nutrition.getProteinTarget() * 0.8) {
            insights.add("Your protein intake is 20% below target. Consider adding eggs, chicken, or lentils.");
        }

        if (nutrition.getCaloriesConsumed() > nutrition.getCaloriesTarget() * 1.1) {
            insights.add("You've exceeded your calorie target for today.");
        } else if (nutrition.getCaloriesConsumed() < nutrition.getCaloriesTarget() * 0.8) {
            insights.add("You are well below your calorie target. Ensure you're eating enough for your goals.");
        }

        if (nutrition.getWaterIntake() < 2.0) {
            insights.add("Hydration is low. Drink more water!");
        }

        return insights;
    }

    public String getDailyHealthTip() {
        String[] tips = {
                "Consistency is key. Keep moving!",
                "Did you know? Drinking water before meals can aid digestion.",
                "Rest is just as important as the workout. Don't skip sleep.",
                "Focus on form over weight to avoid injuries.",
                "A balanced meal includes protein, healthy fats, and complex carbs."
        };
        return tips[(int) (Math.random() * tips.length)];
    }

    public boolean isAbusive(String content) {
        if (content == null)
            return false;
        String[] forbidden = { "abuse", "badword", "offensive" }; // Placeholder for real moderation
        for (String word : forbidden) {
            if (content.toLowerCase().contains(word))
                return true;
        }
        return false;
    }
}
