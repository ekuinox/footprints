use http::StatusCode;
use lambda_http::{
    handler as create_handler,
    lambda_runtime::{run, Context, Error},
    IntoResponse, Request, Response,
};
use serde::Serialize;
use serde_json::to_string;

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(create_handler(handler)).await?;
    Ok(())
}

#[derive(Serialize)]
struct ResponseBody {
    version: String,
}

/// GET /status handler
pub async fn handler(_event: Request, _: Context) -> Result<impl IntoResponse, Error> {
    let response = ResponseBody {
        version: "0.0.1".into(),
    };
    let response = Response::builder()
        .status(StatusCode::OK)
        .body(to_string(&response)?)?;
    Ok(response)
}
