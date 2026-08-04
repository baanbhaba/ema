use crate::models::contracts::ImpactAudit;
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

pub struct ImpactAnalysisAgent {
    client: Client,
    api_key: String,
    model: String,
}

impl ImpactAnalysisAgent {
    pub fn new(api_key: String, model: Option<String>) -> Self {
        Self {
            client: Client::new(),
            api_key,
            model: model.unwrap_or_else(|| "deepseek-reasoner".to_string()),
        }
    }

    pub async fn analyze(&self, ingestion_manifest: &str) -> Result<ImpactAudit, Box<dyn std::error::Error>> {
        let system_prompt = r#"
You are the Impact Analysis Agent (Section 5.3) in EMA (Engineering Migration Assistant).
Evaluate the API surface, database schema dialect risks, configuration file risks, third-party dependency version breaks, and blast radius.
Return a valid JSON object matching the ImpactAudit schema:
{
  "api_surface": [{ "endpoint_or_interface": "string", "consumers": ["string"], "breaking_change_risk": "low|medium|high" }],
  "database_impacts": [{ "component": "string", "risk": "low|medium|high", "notes": "string" }],
  "config_impacts": [{ "file": "string", "risk": "low|medium|high", "notes": "string" }],
  "dependency_risks": [{ "library": "string", "current_version": "string", "target_version": "string", "known_breaking_changes": ["string"] }],
  "blast_radius": [{ "change": "string", "affected_files": ["string"], "severity": "low|medium|high" }],
  "confidence": 0.92
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
        let audit: ImpactAudit = serde_json::from_str(json_content)?;

        Ok(audit)
    }
}
