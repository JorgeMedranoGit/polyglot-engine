// 🦀 Modernized Rust AWS Lambda Handler generated for OrderController.java
use lambda_runtime::{service_fn, Error, LambdaEvent};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct OrderPayload {
    customer_id: String,
    price: f64,
}

pub async fn function_handler(event: LambdaEvent<OrderPayload>) -> Result<(), Error> {
    println!("Transpiled from sample-java-project/src/main/java/com/demo/OrderController.java");
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    lambda_runtime::run(service_fn(function_handler)).await
}