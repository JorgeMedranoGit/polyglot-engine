export const SAMPLE_PROJECTS = [
  {
    id: "java-to-rust-lambda",
    name: "☕ Java Spring Boot Order API -> 🦀 Rust Serverless (Sub-10ms Latencia)",
    description: "Convierte un servicio pesado de Java Spring (500MB+ RAM JVM) a un binario nativo compilado en Rust sobre AWS Graviton (14MB RAM, sub-10ms cold start).",
    sourceLanguage: "Java 17 (Spring Boot 3.0 REST API)",
    targetLanguage: "Rust 1.78 (AWS Lambda Runtime + Graviton)",
    sourceArchitecture: "Monolito Java / Spring Data JPA (JVM)",
    targetArchitecture: "Native Binary Micro-Lambda (Rust Zero-Cost Abstraction)",
    fileTree: [
      {
        name: "OrderController.java",
        path: "src/main/java/com/demo/OrderController.java",
        type: "java",
        selected: true,
        source: `package com.demo;\n\nimport org.springframework.web.bind.annotation.*;\nimport org.springframework.beans.factory.annotation.Autowired;\n\n@RestController\n@RequestMapping("/api/orders")\npublic class OrderController {\n\n    @Autowired\n    private OrderService orderService;\n\n    @PostMapping("/checkout")\n    public OrderResponse checkout(@RequestBody OrderRequest request) {\n        // ❌ BOTTLE-NECK: Heavy JVM Reflection & Dependency Injection\n        return orderService.processOrder(request.getCustomerId(), request.getPrice(), request.getQuantity());\n    }\n}`,
        target: `// 🦀 OrderController.rs - AWS Lambda HTTP Entrypoint Router\nuse lambda_http::{run, service_fn, Body, Error, Request, Response};\nuse serde::{Deserialize, Serialize};\n\n#[derive(Deserialize)]\npub struct OrderRequest {\n    pub customer_id: String,\n    pub price: f64,\n    pub quantity: u32,\n}\n\npub async fn function_handler(event: Request) -> Result<Response<Body>, Error> {\n    let body_bytes = event.body();\n    let request: OrderRequest = serde_json::from_slice(body_bytes)?;\n    \n    // Call Rust OrderService handler\n    let response = crate::OrderService::process_checkout(request).await?;\n    let json_output = serde_json::to_string(&response)?;\n    \n    Ok(Response::builder()\n        .status(201)\n        .header("content-type", "application/json")
        .header("x-kiro-transpiled", "true")\n        .body(Body::from(json_output))?)\n}`
      },
      {
        name: "OrderService.java",
        path: "src/main/java/com/demo/OrderService.java",
        type: "java",
        source: `package com.demo;\n\nimport org.springframework.stereotype.Service;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport java.util.UUID;\n\n@Service\npublic class OrderService {\n\n    @Autowired\n    private OrderRepository orderRepository;\n\n    public OrderResponse processOrder(String customerId, double price, int quantity) {\n        // ❌ BOTTLE-NECK: Synchronous thread execution & JPA transaction commit\n        double totalAmount = price * quantity;\n        String orderId = UUID.randomUUID().toString();\n\n        OrderModel record = new OrderModel(orderId, customerId, totalAmount, "CONFIRMED");\n        orderRepository.save(record);\n\n        return new OrderResponse(orderId, customerId, totalAmount, "CONFIRMED");\n    }\n}`,
        target: `// 🦀 OrderService.rs - Zero-Cost Async Core Business Logic\nuse uuid::Uuid;\nuse serde::Serialize;\n\n#[derive(Serialize)]\npub struct OrderResponse {\n    pub id: String,\n    pub customer_id: String,\n    pub total_amount: f64,\n    pub status: String,\n}\n\npub async font process_checkout(req: crate::OrderController::OrderRequest) -> Result<OrderResponse, anyhow::Error> {\n    // ✅ OPTIMIZATION 1: High-speed zero-cost total amount calculation\n    let total_amount = req.price * (req.quantity as f64);\n    let order_id = Uuid::new_v4().to_string();\n\n    // ✅ OPTIMIZATION 2: Async DynamoDB PutItem persistence\n    crate::OrderRepository::save_order(&order_id, &req.customer_id, total_amount, "CONFIRMED").await?;\n\n    Ok(OrderResponse {\n        id: order_id,\n        customer_id: req.customer_id,\n        total_amount,\n        status: "CONFIRMED".to_string(),\n    })\n}`
      },
      {
        name: "OrderRepository.java",
        path: "src/main/java/com/demo/OrderRepository.java",
        type: "java",
        source: `package com.demo;\n\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.stereotype.Repository;\n\n@Repository\npublic interface OrderRepository extends JpaRepository<OrderModel, String> {\n    // ❌ BOTTLE-NECK: Heavy Hibernate JPA Entity Lifecycle & Connection Locking\n}`,
        target: `// 🦀 OrderRepository.rs - Amazon DynamoDB Native SDK Wrapper\nuse aws_sdk_dynamodb::{Client, AttributeValue};\n\npub async fn save_order(id: &str, customer_id: &str, total: f64, status: &str) -> Result<(), anyhow::Error> {\n    let config = aws_config::load_from_env().await;\n    let client = Client::new(&config);\n\n    client.put_item()\n        .table_name("ECommerceOrders")\n        .item("orderId", AttributeValue::S(id.to_string()))\n        .item("customerId", AttributeValue::S(customer_id.to_string()))\n        .item("totalAmount", AttributeValue::N(total.to_string()))\n        .item("status", AttributeValue::S(status.to_string()))\n        .send()\n        .await?;\n\n    Ok(())\n}`
      },
      {
        name: "OrderModel.java",
        path: "src/main/java/com/demo/OrderModel.java",
        type: "java",
        source: `package com.demo;\n\nimport jakarta.persistence.Entity;\nimport jakarta.persistence.Id;\n\n@Entity\npublic class OrderModel {\n    @Id\n    private String id;\n    private String customerId;\n    private double totalAmount;\n    private String status;\n}`,
        target: `// 🦀 OrderModel.rs - Lightweight Zero-Overhead Data Structs\nuse serde::{Serialize, Deserialize};\n\n#[derive(Serialize, Deserialize, Debug, Clone)]\npub struct OrderRecord {\n    pub id: String,\n    pub customer_id: String,\n    pub total_amount: f64,\n    pub status: String,\n    pub created_at: String,\n}`
      },
      {
        name: "pom.xml",
        path: "pom.xml",
        type: "xml",
        source: `<project xmlns="http://maven.apache.org/POM/4.0.0">\n  <groupId>com.demo</groupId>\n  <artifactId>java-order-service</artifactId>\n  <version>1.0.0</version>\n</project>`,
        target: `[package]\nname = "aws-lambda-rust-order-service"\nversion = "1.0.0"\nedition = "2021"\n\n[dependencies]\nlambda_runtime = "0.8"\nlambda_http = "0.8"\ntokio = { version = "1.28", features = ["full"] }\nserde = { version = "1.0", features = ["derive"] }\nserde_json = "1.0"\naws-config = "0.55"\naws-sdk-dynamodb = "0.28"\nuuid = { version = "1.3", features = ["v4", "fast-rng"] }\nanyhow = "1.0"`
      }
    ],
    metrics: {
      ramReductionPercent: 97,
      speedupFactor: 14.2,
      awsCostReductionPercent: 91,
      legacyRamMb: 512,
      modernRamMb: 14,
      legacyLatencyMs: 240,
      modernLatencyMs: 11,
      legacyTps: 190,
      modernTps: 2400
    },
    graphNodes: [
      { id: "OrderController.java", label: "Order REST Controller", type: "entry", status: "idle", legacyType: "Spring @RestController", targetType: "lambda_http Router" },
      { id: "OrderService.java", label: "Order Business Service", type: "service", status: "idle", legacyType: "Spring @Service Bean", targetType: "Rust Core Handler" },
      { id: "OrderRepository.java", label: "Order JPA Repository", type: "model", status: "idle", legacyType: "Spring Data JPA", targetType: "aws-sdk-dynamodb Client" }
    ],
    graphEdges: [
      { from: "OrderController.java", to: "OrderService.java", label: "Process Order" },
      { from: "OrderService.java", to: "OrderRepository.java", label: "Persist Record" }
    ],
    sourceCode: `// ☕ Java Spring Boot Order & Checkout API\npackage com.demo;\n\nimport org.springframework.web.bind.annotation.*;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport java.util.UUID;\n\n@RestController\n@RequestMapping("/api/orders")\npublic class OrderController {\n\n    @Autowired\n    private OrderService orderService;\n\n    @PostMapping("/checkout")\n    public OrderResponse checkout(@RequestBody OrderRequest request) {\n        return orderService.processOrder(request.getCustomerId(), request.getPrice(), request.getQuantity());\n    }\n}`,
    targetCode: `// 🦀 OrderService.rs - Zero-Cost Async Core Business Logic\nuse uuid::Uuid;\nuse serde::Serialize;\n\n#[derive(Serialize)]\npub struct OrderResponse {\n    pub id: String,\n    pub customer_id: String,\n    pub total_amount: f64,\n    pub status: String,\n}\n\npub async fn process_checkout(req: OrderRequest) -> Result<OrderResponse, Error> {\n    let total_amount = req.price * (req.quantity as f64);\n    let order_id = Uuid::new_v4().to_string();\n\n    OrderRepository::save_order(&order_id, &req.customer_id, total_amount, "CONFIRMED").await?;\n\n    Ok(OrderResponse {\n        id: order_id,\n        customer_id: req.customer_id,\n        total_amount,\n        status: "CONFIRMED".to_string(),\n    })\n}`,
    testCases: [
      {
        name: "Standard Checkout Payload Match",
        inputPayload: { customer_id: "cust_8821", price: 29.99, quantity: 3 },
        expectedOutput: { status: "CONFIRMED", total_amount: 89.97 },
        legacyResponse: { id: "a1b2c3-java-uuid", customer_id: "cust_8821", total_amount: 89.97, status: "CONFIRMED" },
        transpiledResponse: { id: "f9e8d7-rust-uuid", customer_id: "cust_8821", total_amount: 89.97, status: "CONFIRMED" },
        equivalencePassed: true
      }
    ]
  }
];
