import json
import os
import re
import urllib.request
import urllib.error
from flask import current_app

class GeminiService:
    def __init__(self):
        pass

    def generate(self, prompt: str) -> str:
        """Generate text from Gemini using raw HTTP REST requests to bypass blocked gRPC DLLs."""
        try:
            api_key = current_app.config.get('GEMINI_API_KEY') or os.environ.get('GEMINI_API_KEY')
            if not api_key or api_key == "your_gemini_api_key_here":
                raise Exception("GEMINI_API_KEY is not configured or is using the default placeholder.")
            
            # Use the REST API endpoint for Gemini 2.5 Flash
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
            
            data = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            }
            
            req = urllib.request.Request(
                url,
                data=json.dumps(data).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            
            current_app.logger.info(f"Outbound Request URL: {url}")
            current_app.logger.info(f"Outbound Request headers: {req.headers}")
            current_app.logger.info(f"Outbound Request unredirected_hdrs: {req.unredirected_hdrs}")
            
            with urllib.request.urlopen(req) as response:
                response_body = response.read().decode('utf-8')
                result = json.loads(response_body)
                
                # Extract text response from Gemini API structure
                candidates = result.get('candidates', [])
                if not candidates:
                    raise Exception("No content candidates returned from Gemini API.")
                
                content = candidates[0].get('content', {})
                parts = content.get('parts', [])
                if not parts:
                    raise Exception("No parts returned in the response content.")
                
                return parts[0].get('text', '')
                
        except urllib.error.HTTPError as e:
            error_msg = e.read().decode('utf-8')
            current_app.logger.error(f"Gemini API HTTP Error: {e.code} - {error_msg}")
            raise Exception(f"AI generation failed with HTTP error: {e.code}")
        except Exception as e:
            current_app.logger.error(f"Gemini generation error: {e}")
            raise Exception(f"AI generation failed: {str(e)}")

    def generate_json(self, prompt: str) -> dict:
        """Generate and parse JSON response from Gemini."""
        try:
            full_prompt = f"{prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation, no code blocks."
            text = self.generate(full_prompt)
            # Find the first '{' and the last '}' to extract JSON block robustly
            start_idx = text.find('{')
            end_idx = text.rfind('}')
            if start_idx != -1 and end_idx != -1:
                json_str = text[start_idx:end_idx+1]
            else:
                text = re.sub(r'```json\s*', '', text)
                text = re.sub(r'```\s*', '', text)
                json_str = text.strip()
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            current_app.logger.error(f"JSON parse error: {e}, raw: {text[:500]}")
            raise Exception("Failed to parse AI response as JSON")

    def validate_startup_idea(self, name: str, description: str, industry: str, target_audience: str) -> dict:
        from app.prompts.templates import VALIDATION_PROMPT
        prompt = VALIDATION_PROMPT.format(
            name=name, description=description,
            industry=industry, target_audience=target_audience
        )
        return self.generate_json(prompt)

    def generate_market_research(self, name: str, description: str, industry: str, target_audience: str) -> dict:
        from app.prompts.templates import MARKET_RESEARCH_PROMPT
        prompt = MARKET_RESEARCH_PROMPT.format(
            name=name, description=description,
            industry=industry, target_audience=target_audience
        )
        return self.generate_json(prompt)

    def generate_competitor_analysis(self, name: str, description: str, industry: str) -> dict:
        from app.prompts.templates import COMPETITOR_PROMPT
        prompt = COMPETITOR_PROMPT.format(name=name, description=description, industry=industry)
        return self.generate_json(prompt)

    def generate_lean_canvas(self, name: str, description: str, industry: str, target_audience: str) -> dict:
        from app.prompts.templates import LEAN_CANVAS_PROMPT
        prompt = LEAN_CANVAS_PROMPT.format(
            name=name, description=description,
            industry=industry, target_audience=target_audience
        )
        return self.generate_json(prompt)

    def generate_roadmap(self, name: str, description: str, industry: str) -> dict:
        from app.prompts.templates import ROADMAP_PROMPT
        prompt = ROADMAP_PROMPT.format(name=name, description=description, industry=industry)
        return self.generate_json(prompt)

    def generate_revenue_model(self, name: str, description: str, industry: str, model_type: str) -> dict:
        from app.prompts.templates import REVENUE_PROMPT
        prompt = REVENUE_PROMPT.format(
            name=name, description=description,
            industry=industry, model_type=model_type
        )
        return self.generate_json(prompt)

    def generate_branding(self, description: str, industry: str, target_audience: str) -> dict:
        from app.prompts.templates import BRANDING_PROMPT
        prompt = BRANDING_PROMPT.format(
            description=description, industry=industry, target_audience=target_audience
        )
        return self.generate_json(prompt)

    def generate_pitch_deck(self, name: str, description: str, industry: str, target_audience: str) -> dict:
        from app.prompts.templates import PITCH_DECK_PROMPT
        prompt = PITCH_DECK_PROMPT.format(
            name=name, description=description,
            industry=industry, target_audience=target_audience
        )
        return self.generate_json(prompt)

    def match_investors(self, industry: str, stage: str, geography: str, amount: str) -> dict:
        from app.prompts.templates import INVESTOR_MATCH_PROMPT
        prompt = INVESTOR_MATCH_PROMPT.format(
            industry=industry, stage=stage, geography=geography, amount=amount
        )
        return self.generate_json(prompt)

    def generate_marketing_strategy(self, name: str, description: str, industry: str, target_audience: str) -> dict:
        from app.prompts.templates import MARKETING_PROMPT
        prompt = MARKETING_PROMPT.format(
            name=name, description=description,
            industry=industry, target_audience=target_audience
        )
        return self.generate_json(prompt)

    def generate_assessment(self, name: str, description: str, industry: str, target_audience: str) -> dict:
        from app.prompts.templates import ASSESSMENT_PROMPT
        prompt = ASSESSMENT_PROMPT.format(
            name=name, description=description,
            industry=industry, target_audience=target_audience
        )
        return self.generate_json(prompt)

    def chat(self, messages: list, user_message: str) -> str:
        from app.prompts.templates import CHAT_SYSTEM_PROMPT
        conversation = CHAT_SYSTEM_PROMPT + "\n\n"
        for msg in messages[-10:]:  # last 10 messages for context
            role = "User" if msg['role'] == 'user' else "Assistant"
            conversation += f"{role}: {msg['content']}\n"
        conversation += f"User: {user_message}\nAssistant:"
        return self.generate(conversation)

    def predict_trends(self, industry: str) -> dict:
        from app.prompts.templates import TRENDS_PROMPT
        prompt = TRENDS_PROMPT.format(industry=industry)
        return self.generate_json(prompt)


gemini_service = GeminiService()
