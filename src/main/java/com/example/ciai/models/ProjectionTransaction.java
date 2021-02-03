package com.example.ciai.models;
import java.util.Date;

public class ProjectionTransaction {
    private Date date;
    private String description;
    private Float amount;

    public ProjectionTransaction(Float amount, Date date, String description) {
        this.amount = amount;
        this.date = date;
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }
}
