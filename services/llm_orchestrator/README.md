# LLM Orchestrator Service

Generates lecture scripts using Large Language Models via OpenRouter.

## Next Steps

### OpenRouter Integration
1. Add API key: `OPENROUTER_API_KEY` environment variable
2. Implement model selection logic (GPT-4, Claude, etc.)
3. Add prompt templates for different content types
4. Implement streaming for long responses

### Implementation Tasks
```python
import requests

def call_openrouter(prompt, model="openai/gpt-4"):
    headers = {
        "Authorization": f"Bearer {os.environ['OPENROUTER_API_KEY']}",
        "Content-Type": "application/json"
    }
    data = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}]
    }
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", 
                           headers=headers, json=data)
    return response.json()
```

### Vision Integration
- Add vision model calls for figure descriptions
- Implement multimodal prompts combining text and images
- Add context from extracted figures to script generation
