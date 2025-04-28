package com.backend.backend.controller;

import com.backend.backend.entity.ChallengeEntity;
import com.backend.backend.exception.ChallengeNotFoundException;
import com.backend.backend.repository.ChallengeRepository;
import com.backend.backend.service.ChallengeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/challenges")
@CrossOrigin("http://localhost:3000")
public class ChallengeController {
    @Autowired

    private ChallengeRepository challengeRepository;

    //insert crud
    @PostMapping("/challenge") //call the path. need in frontend
    public ChallengeEntity addChallenge(@RequestBody ChallengeEntity addChallenge) {    //object create
        return challengeRepository.save(addChallenge);
    }

    //normal display crud
    @GetMapping("/viewChallenge")
    List<ChallengeEntity> getAllChallenges() {
        return challengeRepository.findAll();
    }

    //get by id crud
    @GetMapping("/viewChallenge/{challengeId}")
    ChallengeEntity getChallengeId(@PathVariable String challengeId) {
        return challengeRepository.findById(challengeId).orElseThrow(() -> new ChallengeNotFoundException(challengeId));
    }

    //update crud
    @PutMapping("/updateChallenge/{challengeId}")
    public ChallengeEntity updateChallenge(
            @RequestPart(value = "challengeDetails") String challengeDetails,
            @PathVariable String challengeId
    ) {
        System.out.println("Challenge Details: " + challengeDetails);

        ObjectMapper mapper = new ObjectMapper();
        ChallengeEntity newChallenge;
        try {
            newChallenge = mapper.readValue(challengeDetails, ChallengeEntity.class);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing challenge details", e);
        }
//find the existing challenge  by ID
        return challengeRepository.findById(challengeId).map(existingChallenge -> {
            // Update the basic fields
            existingChallenge.setChallengeTitle(newChallenge.getChallengeTitle());
            existingChallenge.setChallengeDescription(newChallenge.getChallengeDescription());
            existingChallenge.setBadgeAwarded(newChallenge.getBadgeAwarded());

            // Update the questions by iterating through the question lists
            List<ChallengeEntity.Question> updatedQuestions = newChallenge.getQuestions();
            List<ChallengeEntity.Question> existingQuestions = existingChallenge.getQuestions();

            for (int i = 0; i < updatedQuestions.size(); i++) {
                ChallengeEntity.Question updatedQuestion = updatedQuestions.get(i);
                if (i < existingQuestions.size()) {
                    // Update existing question
                    existingQuestions.get(i).setQuestionText(updatedQuestion.getQuestionText());
                    existingQuestions.get(i).setOptions(updatedQuestion.getOptions());
                    existingQuestions.get(i).setCorrectAnswer(updatedQuestion.getCorrectAnswer());
                } else {
                    // Add new question if it's not in the existing list
                    existingQuestions.add(updatedQuestion);
                }
            }

            // Remove any questions from the existing list that are not in the updated list
            for (int i = updatedQuestions.size(); i < existingQuestions.size(); i++) {
                existingQuestions.remove(i);
            }

            // Save and return the updated challenge entity
            return challengeRepository.save(existingChallenge);
        }).orElseThrow(() -> new ChallengeNotFoundException(challengeId));


    }

    //delete part
    @DeleteMapping("/deleteChallenge/{challengeId}")
    String deleteChallenge(@PathVariable String challengeId) {
        //check challenge exists in db
        ChallengeEntity challengeItem = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ChallengeNotFoundException(challengeId));


        //delete item from repo
        challengeRepository.delete(challengeItem);
        return "data with challengeID:" + challengeId + " deleted";

    }


    @PutMapping("/post/{id}")
    public ResponseEntity<String> postQuiz(@PathVariable String id) {
        ChallengeEntity quiz = challengeRepository.findById(id).orElse(null);
        if (quiz == null) return ResponseEntity.notFound().build();
        quiz.setPosted(true);
        challengeRepository.save(quiz);
        return ResponseEntity.ok("Quiz posted successfully");
    }

    @GetMapping("/posted")
    public List<ChallengeEntity> getPostedQuizzes() {
        return challengeRepository.findByIsPostedTrue();
    }




}



