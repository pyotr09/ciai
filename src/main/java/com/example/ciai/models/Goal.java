package com.example.ciai.models;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class Goal {
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
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    private Date date;
    public Date getDate() {return date;}
    public void setDate(Date date) {this.date = date;}

    private Date createdDate;
    public Date getCreatedDate() {
        return createdDate;
    }
    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    @OneToMany(mappedBy = "goal", orphanRemoval = true)
    private List<GoalAccountBalance> goalAccountBalances;

    public List<GoalAccountBalance> getGoalAccountBalances() {
        return goalAccountBalances;
    }

    public void setGoalAccountBalances(List<GoalAccountBalance> goalAccountBalances) {
        this.goalAccountBalances = goalAccountBalances;
    }
}
