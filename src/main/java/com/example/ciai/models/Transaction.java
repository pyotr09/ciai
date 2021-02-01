package com.example.ciai.models;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    private String userId;
    public String getUserId() {return userId;}
    public void setUserId(String userId) {this.userId = userId;}

    private String description;
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    private Date date;
    public Date getDate() {return date;}
    public void setDate(Date date) {this.date = date;}

    private Float amount;
    public Float getAmount() {return amount;}
    public void setAmount(Float amount) {this.amount = amount;}

    @ManyToOne
    @JoinColumn(name="account_id")
    private Account account;
    public Account getAccount() {return account;}
    public void setAccount(Account account) {this.account = account;}


    private Integer toAccountId;
    public Integer getToAccountId() {
        return toAccountId;
    }
    public void setToAccountId(Integer toAccountId) {
        this.toAccountId = toAccountId;
    }
}
