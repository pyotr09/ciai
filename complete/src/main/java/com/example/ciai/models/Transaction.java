package com.example.ciai.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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

    private Integer userId;
    public Integer getUserId() {return userId;}
    public void setUserId(Integer userId) {this.userId = userId;}

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

    private Integer accountId;
    public Integer getAccountId() {
        return accountId;
    }
    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    private Integer toAccountId;
    public Integer getToAccountId() {
        return toAccountId;
    }
    public void setToAccountId(Integer toAccountId) {
        this.toAccountId = toAccountId;
    }
}
