package com.backend.backend.controller;

import com.backend.backend.entity.ChallengeEntity;
import com.backend.backend.entity.Submission;
import com.backend.backend.entity.SubmissionRequest;
import com.backend.backend.repository.ChallengeRepository;
import com.backend.backend.repository.SubmissionRepository;
import com.backend.backend.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepo;

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private JWTService jwtService; //  Inject JWTService

    @PostMapping("/submit")
    public ResponseEntity<String> submitQuiz(@RequestBody SubmissionRequest request, @RequestHeader("Authorization") String token) {


        // Extract userId from JWT token
        String userId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");




        ChallengeEntity quiz = challengeRepository.findById(request.getChallengeId()).orElse(null);
        if (quiz == null) return ResponseEntity.badRequest().body("Invalid quiz ID");

        int score = 0;
        for (int i = 0; i < quiz.getQuestions().size(); i++) {
            if (quiz.getQuestions().get(i).getCorrectAnswer().equals(request.getAnswers().get(i))) {
                score++;
            }
        }

        Submission sub = new Submission();
        sub.setChallengeId(request.getChallengeId());
        sub.setUserId(userId);
        sub.setName(request.getName());
        sub.setEmail(request.getEmail());
        sub.setScore(score);

        submissionRepo.save(sub);
        return ResponseEntity.ok("Submitted successfully with score: " + score);
    }

    @GetMapping("/leaderboard/{quizId}")
    public List<Submission> getLeaderboard(@PathVariable String quizId) {
        return submissionRepo.findByChallengeIdOrderByScoreDesc(quizId);
    }

    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionRepo.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Submission> getSubmissionsByUser(@PathVariable String userId) {
        return submissionRepo.findByUserId(userId);
    }

}
