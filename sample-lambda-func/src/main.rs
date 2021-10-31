use lambda_http::{Request, handler as create_handler, lambda_runtime::{run, Context, Error}, Body, Response, IntoResponse};
use serde_json::{from_str, to_string};
use serde::{Deserialize, Serialize};
use http::{StatusCode};

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(create_handler(handler)).await?;
    Ok(())
}


#[derive(Deserialize)]
struct RequestBody {
    name: String,
}

#[derive(Serialize)]
struct ResponseBody {
    name: String,
}

pub async fn handler(event: Request, _: Context) -> Result<impl IntoResponse, Error> {
    let body = match event.body() {
        Body::Text(body) => body,
        _ => { return Err(Error::from("")); },
    };
    let body: RequestBody = from_str(body)?;
    let response = ResponseBody {
        name: body.name,
    };
    let response = Response::builder()
        .status(StatusCode::OK)
        .body(to_string(&response)?)?;
    Ok(response)
}
