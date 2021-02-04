package com.example.ciai.controllers;

import com.example.ciai.models.Goal;
import com.example.ciai.respositories.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(path="/goal")
public class GoalController {
    @Autowired
    private GoalRepository goalRepository;
    @GetMapping(path="/get")
    public @ResponseBody
    Iterable<Goal> getGoals(@RequestParam String userId) {
        return goalRepository.findByUserId(userId);
    }
}
