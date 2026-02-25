package com.wellnest.service;

import com.wellnest.dto.TipDTO;
import com.wellnest.entity.Tip;
import com.wellnest.repository.TipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class TipService {

    @Autowired
    private TipRepository tipRepository;

    public List<TipDTO> getActiveTips() {
        return tipRepository.findByActiveTrue().stream()
                .map(this::mapToTipDTO)
                .collect(Collectors.toList());
    }

    public TipDTO getRandomActiveTip() {
        List<Tip> activeTips = tipRepository.findByActiveTrue();
        if (activeTips.isEmpty()) {
            return mapToTipDTO(Tip.builder().content("Stay hydrated!").active(true).build());
        }

        // Use current date as seed to ensure "Tip of the Day" remains same for the day
        long seed = java.time.LocalDate.now().toEpochDay();
        int index = new Random(seed).nextInt(activeTips.size());

        return mapToTipDTO(activeTips.get(index));
    }

    public List<TipDTO> getAllTips() {
        return tipRepository.findAll().stream()
                .map(this::mapToTipDTO)
                .collect(Collectors.toList());
    }

    public TipDTO createTip(String content) {
        Tip tip = Tip.builder().content(content).active(true).build();
        Tip savedTip = tipRepository.save(tip);
        return mapToTipDTO(java.util.Objects.requireNonNull(savedTip));
    }

    public TipDTO toggleTipActivation(Long id) {
        if (id == null)
            throw new IllegalArgumentException("ID must not be null");
        Tip tip = tipRepository.findById(id).orElseThrow(() -> new RuntimeException("Tip not found"));
        tip.setActive(!tip.isActive());
        Tip savedTip = tipRepository.save(tip);
        return mapToTipDTO(java.util.Objects.requireNonNull(savedTip));
    }

    public void deleteTip(Long id) {
        if (id == null)
            throw new IllegalArgumentException("ID must not be null");
        tipRepository.deleteById(id);
    }

    private TipDTO mapToTipDTO(Tip tip) {
        TipDTO dto = new TipDTO();
        dto.setId(tip.getId());
        dto.setContent(tip.getContent());
        dto.setActive(tip.isActive());
        return dto;
    }
}
