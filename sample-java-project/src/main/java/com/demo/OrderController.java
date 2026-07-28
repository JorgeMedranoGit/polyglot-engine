package com.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public OrderResponse checkout(@RequestBody OrderRequest request) {
        // Delegate order processing to service layer
        return orderService.processOrder(request.getCustomerId(), request.getPrice(), request.getQuantity());
    }
}
