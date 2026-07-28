package com.demo;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.UUID;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public OrderResponse processOrder(String customerId, double price, int quantity) {
        // ❌ Synchronous business logic & thread blocking
        double totalAmount = price * quantity;
        String orderId = UUID.randomUUID().toString();

        OrderModel record = new OrderModel(orderId, customerId, totalAmount, "CONFIRMED");
        orderRepository.save(record);

        return new OrderResponse(orderId, customerId, totalAmount, "CONFIRMED");
    }
}
