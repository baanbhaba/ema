use crate::models::contracts::CoreAudit;
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Serialize)]
struct ResponseFormat {
    r#type: String,
}

#[derive(Serialize)]
struct DeepSeekRequest {
    model: String,
    messages: Vec<ChatMessage>,
    response_format: ResponseFormat,
}

#[derive(Deserialize)]
struct ChatChoiceMessage {
    content: String,
}

#[derive(Deserialize)]
struct ChatChoice {
    message: ChatChoiceMessage,
}

#[derive(Deserialize)]
struct DeepSeekResponse {
    choices: Vec<ChatChoice>,
}

pub struct CoreAnalysisAgent {
    client: Client,
    api_key: String,
    model: String,
}

impl CoreAnalysisAgent {
    pub fn new(api_key: String, model: Option<String>) -> Self {
        Self {
            client: Client::new(),
            api_key,
            model: model.unwrap_or_else(|| "deepseek-reasoner".to_string()),
        }
    }

    pub async fn analyze(&self, ingestion_manifest: &str) -> Result<CoreAudit, Box<dyn std::error::Error>> {
        let system_prompt = r#"
You are the Core Analysis Agent (Section 5.2) in EMA (Engineering Migration Assistant).
Analyze the provided Java 8 project manifest and AST details.
Return a valid JSON object matching the CoreAudit schema:
{
  "architecture_summary": "string",
  "detected_stack": [{ "technology": "string", "version": "string", "status": "current|deprecated|eol" }],
  "deprecated_usages": [{ "file": "string", "line": 0, "pattern": "string", "recommended_replacement": "string" }],
  "dependency_graph": { "nodes": ["string"], "edges": [{ "from": "string", "to": "string" }] },
  "diagrams": [{ "type": "class|component|sequence", "format": "mermaid", "content": "string" }],
  "confidence": 0.95
}
"#;

        let request_payload = DeepSeekRequest {
            model: self.model.clone(),
            messages: vec![
                ChatMessage {
                    role: "system".to_string(),
                    content: system_prompt.to_string(),
                },
                ChatMessage {
                    role: "user".to_string(),
                    content: format!("Project Ingestion Manifest:\n{}", ingestion_manifest),
                },
            ],
            response_format: ResponseFormat {
                r#type: "json_object".to_string(),
            },
        };

        let response = self
            .client
            .post("https://api.deepseek.com/chat/completions")
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(&request_payload)
            .send()
            .await?;

        let res_text = response.text().await?;
        let parsed_res: DeepSeekResponse = serde_json::from_str(&res_text)?;

        let json_content = &parsed_res.choices.first().ok_or("No choice returned")?.message.content;
        let audit: CoreAudit = serde_json::from_str(json_content)?;

        Ok(audit)
    }
}
