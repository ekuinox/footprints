use lambda::handler_fn;

#[tokio::main]
async fn main() -> Result<(), LambdaError> {
    println!("execute bootstrap#main");
    let runtime_handler = handler_fn(handler);
    lambda::run(runtime_handler).await?;
    Ok(())
}

use lambda::Context;
use serde_json::{json, Value};

pub type LambdaError = Box<dyn std::error::Error + Send + Sync + 'static>;

pub async fn handler(event: Value, _: Context) -> Result<Value, LambdaError> {
    println!("execute lib#handler");
    let name = event["name"].as_str().unwrap_or("world");
    Ok(json!({ "message": format!("Hello, {}!", name) }))
}
