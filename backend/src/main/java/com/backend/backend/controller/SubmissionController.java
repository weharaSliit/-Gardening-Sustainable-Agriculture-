package com.backend.backend.controller;

import com.backend.backend.entity.ChallengeEntity;
import com.backend.backend.entity.Submission;
import com.backend.backend.entity.SubmissionRequest;
import com.backend.backend.repository.ChallengeRepository;
import com.backend.backend.repository.SubmissionRepository;
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

    @PostMapping("/submit")
    public ResponseEntity<String> submitQuiz(@RequestBody SubmissionRequest request) {
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
}
