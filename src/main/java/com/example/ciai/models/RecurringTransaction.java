package com.example.ciai.models;

import javax.persistence.*;
import java.util.Date;

@Entity
public class RecurringTransaction {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    private RecurringType type;
    public RecurringType getType() {
        return type;
    }
    public void setType(RecurringType type) {
        this.type = type;
    }

    private Float amount;
    public Float getAmount() {
        return amount;
    }
    public void setAmount(Float amount) {
        this.amount = amount;
    }

    private String description;
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    private String userId;
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

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

    private Date startDate;
    public Date getStartDate() {
        return startDate;
    }
    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    private Date endDate;
    public Date getEndDate() {
        return endDate;
    }
    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    private Integer daysInterval;
    public Integer getDaysInterval() {
        return daysInterval;
    }
    public void setDaysInterval(Integer daysInterval) {
        this.daysInterval = daysInterval;
    }
}
