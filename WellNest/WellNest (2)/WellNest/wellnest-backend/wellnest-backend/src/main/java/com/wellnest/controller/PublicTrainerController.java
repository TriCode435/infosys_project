package com.wellnest.controller;

import com.wellnest.dto.TrainerProfileDTO;
import com.wellnest.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicTrainerController {

    @Autowired
    private TrainerService trainerService;

    @GetMapping("/search")
    public ResponseEntity<Page<TrainerProfileDTO>> searchTrainers(
            @RequestParam(required = false) String goal,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "false") boolean availableOnly,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "averageRating,desc") String sort) {

        String[] sortParams = sort.split(",");
        Sort sortObj = Sort.by(sortParams[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                sortParams[0]);

        Pageable pageable = PageRequest.of(page, size, sortObj);

        return ResponseEntity.ok(trainerService.searchTrainers(goal, minRating, availableOnly, maxPrice, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainerProfileDTO> getTrainerProfile(@PathVariable Long id) {
        return ResponseEntity.ok(trainerService.getTrainerById(id));
    }
}
