# PDF Audiobook Services

Lambda functions for the PDF to audiobook processing pipeline.

## Services Overview

- **ingest_pdf**: Process uploaded PDF and extract metadata
- **extract_text**: Extract text content using OCR/parsing
- **extract_figures**: Extract images and figures from PDF
- **create_beats**: Generate narrative structure and beats
- **llm_orchestrator**: Generate scripts using LLM (OpenRouter)
- **verify_scripts**: Validate and quality-check generated scripts
- **tts_adapter**: Convert scripts to audio using TTS
- **finalize**: Package final audiobook for delivery

## Running Tests

```bash
cd services/<service_name>
python -m pytest test_handler.py -v
```

## Next Steps for Implementation

### LLM Integration (OpenRouter)
1. Add OpenRouter API key to environment variables
2. Implement proper prompt engineering for script generation
3. Add retry logic and error handling
4. Implement streaming for long content

### Vision Integration
1. Add vision model calls for figure analysis
2. Implement image-to-text descriptions
3. Add chart/diagram interpretation
4. Integrate visual context into scripts

### Production Considerations
1. Add proper error handling and retries
2. Implement logging and monitoring
3. Add input validation and sanitization
4. Optimize for Lambda cold starts
5. Add circuit breakers for external APIs
