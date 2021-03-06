package com.example.ciai.controllers;

import com.example.ciai.models.Account;
import com.example.ciai.models.RecurringTransaction;
import com.example.ciai.models.RecurringType;
import com.example.ciai.models.Transaction;
import com.example.ciai.respositories.RecurringTransactionRepository;
import com.example.ciai.respositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@Controller
@RequestMapping(path="/transaction")
public class TransactionController {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private RecurringTransactionRepository recurringTransactionRepository;

    @PostMapping(path="/add")
    public @ResponseBody String addNewTransaction(@RequestParam String userId,
                             @RequestParam String description,
                             @RequestParam Float amount,
                             @RequestParam Date date,
                             @RequestParam Account account,
                             @RequestParam Account toAccount) {

        Transaction t = new Transaction();
        t.setUserId(userId);
        t.setDescription(description);
        t.setDate(date);
        t.setAccount(account);
        t.setToAccount(toAccount);
        t.setAmount(amount);
        transactionRepository.save(t);

        return "Transaction Saved.";
    }

    @GetMapping(path="/get")
    public @ResponseBody Iterable<Transaction> getTransactions(
            @RequestParam String userId) {
        return transactionRepository.findByUserId(userId);
    }

    @GetMapping(path="/getRecurring")
    public @ResponseBody Iterable<RecurringTransaction> getRecurringTransactions(
            @RequestParam String userId) {
        return recurringTransactionRepository.findByUserId(userId);
    }

    @GetMapping(path="/getForDate")
    public @ResponseBody Iterable<Transaction> getTransactionsForAccountBetweenDates(
            @RequestParam String userId,
            @RequestParam Integer accountId,
            @RequestParam Date startDate,
            @RequestParam Date endDate) {
        return transactionRepository.findAllByUserIdAndAccountIdAndDateBetween(userId, accountId,
                startDate, endDate);
    }

    @PostMapping(path="/addRecurring")
    public @ResponseBody String addNewRecurringTransaction(
            @RequestParam String userId,
            @RequestParam String description,
            @RequestParam Float amount,
            @RequestParam Date startDate,
            @RequestParam Date endDate,
            @RequestParam Account account,
            @RequestParam Account toAccount,
            @RequestParam Integer numDays) {

        RecurringTransaction t = new RecurringTransaction();
        t.setUserId(userId);
        t.setDescription(description);
        t.setStartDate(startDate);
        t.setEndDate(endDate);
        t.setAccount(account);
        t.setType(RecurringType.INTERVAL_FREQUENCY);
        t.setToAccount(toAccount);
        t.setAmount(amount);
        t.setDaysInterval(numDays);
        recurringTransactionRepository.save(t);

        return "Transaction Saved.";
    }

    @GetMapping(path="/getRecurringForAccount")
    public @ResponseBody Iterable<RecurringTransaction> getRecurringTransactions(
            @RequestParam String userId,
            @RequestParam Integer accountId) {
        return recurringTransactionRepository.findAllByUserIdAndAccountId(userId, accountId);
    }
}
