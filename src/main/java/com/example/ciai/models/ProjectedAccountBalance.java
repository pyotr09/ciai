package com.example.ciai.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ProjectedAccountBalance {
    private Account account;
    private Float balance;
    private Date date;
    private List<ProjectionTransaction> transactions;

    public ProjectedAccountBalance() {
        this.date = new Date();
        this.account = null;
        this.balance = 0.00f;
        this.transactions = new ArrayList<ProjectionTransaction>();
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

    public List<ProjectionTransaction> getTransactions() {return transactions;}

    public void addTransaction(ProjectionTransaction projectionTransaction) {
        transactions.add(projectionTransaction);
    }
}
