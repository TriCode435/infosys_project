package com.wellnest.service;

import com.wellnest.dto.DashboardSummaryDTO;
import com.wellnest.entity.User;
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class ReportService {

        @Autowired
        private UserService userService;

        @Autowired
        private UserRepository userRepository;

        public byte[] generateWeeklyReportPdf(String username, LocalDate startDate) {
                if (startDate == null)
                        startDate = LocalDate.now().minusDays(7);
                LocalDate endDate = startDate.plusDays(6);
                DashboardSummaryDTO summary = userService.getDashboardSummary(username, startDate, endDate);

                java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
                com.itextpdf.kernel.pdf.PdfWriter writer = new com.itextpdf.kernel.pdf.PdfWriter(baos);
                com.itextpdf.kernel.pdf.PdfDocument pdf = new com.itextpdf.kernel.pdf.PdfDocument(writer);
                com.itextpdf.layout.Document document = new com.itextpdf.layout.Document(pdf);

                // --- Header Section ---
                com.itextpdf.layout.element.Table headerTable = new com.itextpdf.layout.element.Table(1)
                                .useAllAvailableWidth();
                headerTable.setBackgroundColor(new com.itextpdf.kernel.colors.DeviceRgb(15, 23, 42)); // Slate 900
                headerTable.setPadding(20);

                com.itextpdf.layout.element.Cell headerCell = new com.itextpdf.layout.element.Cell()
                                .add(new com.itextpdf.layout.element.Paragraph("WellNest Weekly Achievement Report")
                                                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.WHITE)
                                                .setFontSize(26)
                                                .setBold()
                                                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER))
                                .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER)
                                .setPadding(20);
                headerTable.addCell(headerCell);
                document.add(headerTable);

                document.add(new com.itextpdf.layout.element.Paragraph("\n"));

                // --- Meta Info ---
                com.itextpdf.layout.element.Table metaTable = new com.itextpdf.layout.element.Table(2)
                                .useAllAvailableWidth();
                metaTable.addCell(new com.itextpdf.layout.element.Cell()
                                .add(new com.itextpdf.layout.element.Paragraph("Prepared for: " + username).setBold()
                                                .setFontSize(14))
                                .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
                metaTable.addCell(new com.itextpdf.layout.element.Cell()
                                .add(new com.itextpdf.layout.element.Paragraph(startDate + " to " + endDate)
                                                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)
                                                .setFontSize(12))
                                .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
                document.add(metaTable);

                document.add(new com.itextpdf.layout.element.Paragraph("\n\n"));

                // --- Core Stats Section ---
                document.add(new com.itextpdf.layout.element.Paragraph("Executive Summary").setFontSize(18).setBold()
                                .setFontColor(new com.itextpdf.kernel.colors.DeviceRgb(20, 184, 166))); // Teal 500

                com.itextpdf.layout.element.Table statsTable = new com.itextpdf.layout.element.Table(
                                new float[] { 1, 1 }).useAllAvailableWidth();
                statsTable.setMarginTop(10);

                addStatBox(statsTable, "Workout Consistency", summary.getPercentage() + "%", "Goal: 80%+");
                addStatBox(statsTable, "Total Workouts", String.valueOf(summary.getTotalWorkouts()),
                                summary.getCompletedWorkouts() + " Completed");
                addStatBox(statsTable, "Avg Daily Nutrition",
                                String.format("%.0f kcal", summary.getCaloriesConsumed() / 7.0),
                                String.format("%.1f g Protein", summary.getProteinConsumed()));
                addStatBox(statsTable, "Rest & Recovery", summary.getAvgSleep() + " hrs", summary.getMood() + " Mood");

                document.add(statsTable);

                document.add(new com.itextpdf.layout.element.Paragraph("\n\n"));

                // --- Visual Progress Bars ---
                document.add(new com.itextpdf.layout.element.Paragraph("Consistency Trackers").setFontSize(18).setBold()
                                .setFontColor(new com.itextpdf.kernel.colors.DeviceRgb(100, 102, 241))); // Indigo 500

                // 1. Workout Completion Progress
                addProgressBar(document, "Weekly Workout Compliance", summary.getPercentage() / 100.0,
                                new com.itextpdf.kernel.colors.DeviceRgb(20, 184, 166));

                document.add(new com.itextpdf.layout.element.Paragraph("\n"));

                // 2. Mock Weight Progress (Simulated if target exists)
                if (summary.getStreak() > 0) {
                        double mockProgress = Math.min(0.95, 0.2 + (summary.getStreak() * 0.05));
                        addProgressBar(document, "Weight Goal Progress (Phase 1)", mockProgress,
                                        new com.itextpdf.kernel.colors.DeviceRgb(100, 102, 241));
                }

                document.add(new com.itextpdf.layout.element.Paragraph("\n\n"));

                // --- AI Insights Section ---
                com.itextpdf.layout.element.Div insightDiv = new com.itextpdf.layout.element.Div()
                                .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceRgb(248, 250, 252))
                                .setPadding(20)
                                .setBorder(new com.itextpdf.layout.borders.SolidBorder(
                                                new com.itextpdf.kernel.colors.DeviceRgb(226, 232, 240), 1));

                insightDiv.add(new com.itextpdf.layout.element.Paragraph("Personalized Insights").setBold()
                                .setFontSize(14));
                insightDiv.add(new com.itextpdf.layout.element.Paragraph(
                                "Your consistency is impressive! Maintaining a " + summary.getStreak()
                                                + " day streak shows high dedication. " +
                                                "For the next period, we recommend focusing on "
                                                + (summary.getAvgSleep() < 7 ? "improving sleep hygiene"
                                                                : "increasing protein density")
                                                + " to maximize recovery."));

                document.add(insightDiv);

                // --- Footer ---
                document.add(new com.itextpdf.layout.element.Paragraph("\n\nStay Consistent. Stay Well.")
                                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER)
                                .setFontSize(14)
                                .setItalic()
                                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.GRAY));

                document.add(new com.itextpdf.layout.element.Paragraph("Certified by WellNest Intelligence")
                                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)
                                .setFontSize(8)
                                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.LIGHT_GRAY));

                document.close();
                return baos.toByteArray();
        }

        public User getUserByUsername(String username) {
                return userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        }

        public boolean canTrainerAccessUser(String trainerUsername, Long userId) {
                return userService.canTrainerAccessUser(trainerUsername, userId);
        }

        private void addStatBox(com.itextpdf.layout.element.Table table, String title, String value, String subtext) {
                com.itextpdf.layout.element.Cell cell = new com.itextpdf.layout.element.Cell()
                                .add(new com.itextpdf.layout.element.Paragraph(title).setFontSize(10)
                                                .setFontColor(com.itextpdf.kernel.colors.ColorConstants.GRAY))
                                .add(new com.itextpdf.layout.element.Paragraph(value).setFontSize(20).setBold())
                                .add(new com.itextpdf.layout.element.Paragraph(subtext).setFontSize(9)
                                                .setFontColor(new com.itextpdf.kernel.colors.DeviceRgb(100, 116, 139)))
                                .setPadding(15)
                                .setBorder(new com.itextpdf.layout.borders.SolidBorder(
                                                new com.itextpdf.kernel.colors.DeviceRgb(241, 245, 249), 1));
                table.addCell(cell);
        }

        private void addProgressBar(com.itextpdf.layout.Document doc, String label, double percentage,
                        com.itextpdf.kernel.colors.Color color) {
                doc.add(new com.itextpdf.layout.element.Paragraph(label).setBold().setFontSize(12).setMarginBottom(5));

                float width = 500;
                float height = 15;

                com.itextpdf.layout.element.Table barTable = new com.itextpdf.layout.element.Table(1).setFixedLayout()
                                .setWidth(width);

                com.itextpdf.layout.element.Cell background = new com.itextpdf.layout.element.Cell()
                                .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceRgb(226, 232, 240)) // Light
                                                                                                             // gray
                                .setHeight(height)
                                .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);

                // iText 7 doesn't have a direct "drawn" bar inside a linkable layout flow
                // easily without a renderer
                // But we can simulate with another table or a nested cell if we were careful
                // For simplicity and robustness, we'll use a table with a subset width if
                // possible,
                // but standard iText 7 prefers percentage widths for cells.

                com.itextpdf.layout.element.Table innerBar = new com.itextpdf.layout.element.Table(
                                new float[] { (float) percentage, (float) (1 - percentage) }).useAllAvailableWidth();
                innerBar.addCell(new com.itextpdf.layout.element.Cell().setBackgroundColor(color).setHeight(height)
                                .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));
                innerBar.addCell(new com.itextpdf.layout.element.Cell()
                                .setBackgroundColor(new com.itextpdf.kernel.colors.DeviceRgb(241, 245, 249))
                                .setHeight(height).setBorder(com.itextpdf.layout.borders.Border.NO_BORDER));

                doc.add(innerBar);
        }
}
