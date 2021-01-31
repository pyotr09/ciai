package com.example.ciai.controllers;

import com.example.ciai.models.*;
import com.example.ciai.respositories.AccountRepository;
import com.example.ciai.respositories.RecurringTransactionRepository;
import com.example.ciai.respositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;

@Controller
@RequestMapping(path="/projection")
public class ProjectionController {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private RecurringTransactionRepository recurringTransactionRepository;

    @GetMapping(path = "/calculate")
    public @ResponseBody
    Iterable<ProjectedAccountBalance> calculateProjection(
            @RequestParam String userId,
            @RequestParam Date startDate,
            @RequestParam Date endDate) {
        return new ProjectionHelper(accountRepository, transactionRepository, recurringTransactionRepository)
                .calculate(userId, startDate, endDate);
    }
}
