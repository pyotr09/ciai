package com.example.ciai.models;

import javax.persistence.*;
import java.util.List;

@Entity
public class Account {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    private String name;
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    private float currentBalance;
    public float getCurrentBalance() {return currentBalance;}
    public void setCurrentBalance(float balance) {this.currentBalance = balance;}

    private String userId;
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    @OneToMany(mappedBy = "account")
    private List<Transaction> transactions;

}
