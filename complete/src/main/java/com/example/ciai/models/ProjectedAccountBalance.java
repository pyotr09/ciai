package com.example.ciai.models;

import java.util.Date;

public class ProjectedAccountBalance {
    private Account account;
    private Float balance;
    private Date date;

    public ProjectedAccountBalance(Date date, Account account, Float balance) {
        this.date = date;
        this.account = account;
        this.balance = balance;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Float getBalance() {
        return balance;
    }

    public void setBalance(Float balance) {
        this.balance = balance;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
