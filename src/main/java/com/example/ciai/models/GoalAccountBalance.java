package com.example.ciai.models;

import javax.persistence.*;

@Entity
public class GoalAccountBalance {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
    public Account getAccount() {return account;}
    public void setAccount(Account account) {this.account = account;}

    private Float balance;
    public Float getBalance() {return balance;}
    public void setBalance(Float balance) {this.balance = balance;}

    @ManyToOne
    @JoinColumn(name = "goal_id")
    private Goal goal;
}
