package com.demo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class OrderModel {

    @Id
    private String id;
    private String customerId;
    private double totalAmount;
    private String status;

    public OrderModel() {}

    public OrderModel(String id, String customerId, double totalAmount, String status) {
        this.id = id;
        this.customerId = customerId;
        this.totalAmount = totalAmount;
        this.status = status;
    }

    public String getId() { return id; }
    public String getCustomerId() { return customerId; }
    public double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
}
