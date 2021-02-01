package com.example.ciai.controllers;

import com.example.ciai.models.Account;
import com.example.ciai.respositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(path="/account")
public class AccountController {
    @Autowired
    private AccountRepository accountRepository;

    @PostMapping(path="/add")
    public @ResponseBody String addNewAccount(@RequestParam String userId, @RequestParam String name,
                                              @RequestParam Float balance) {
        Account a = new Account();
        a.setUserId(userId);
        a.setName(name);
        a.setCurrentBalance(balance);
        accountRepository.save(a);

        return "Account Saved.";
    }

    @GetMapping(path="/get")
    public @ResponseBody Iterable<Account> getAccounts(@RequestParam String userId) {
        return accountRepository.findByUserId(userId);
    }

    @PostMapping(path="/edit")
    public @ResponseBody String editAccount(@RequestParam Integer id,
                                            @RequestParam String userId,
                                            @RequestParam String name,
                                            @RequestParam Float balance) {

        Account a = accountRepository.findByIdAndUserId(id, userId);
        if (a == null)
            return "Error: Account Not found.";
        a.setName(name);
        a.setCurrentBalance(balance);
        accountRepository.save(a);

        return "Account Updated.";
    }
}
