# Extract Figures Service

Extracts images, charts, and diagrams from PDF documents.

## Next Steps

### Vision Model Integration
1. Add vision model API calls (GPT-4V, Claude Vision)
2. Implement image analysis and description generation
3. Add chart/diagram interpretation
4. Extract text from images (OCR)

### Implementation Tasks
```python
import base64

def analyze_image_with_vision(image_bytes, model="gpt-4-vision-preview"):
    base64_image = base64.b64encode(image_bytes).decode('utf-8')
    
    prompt = "Describe this image in detail, focusing on any charts, diagrams, or important visual information that would be relevant for an audiobook."
    
    # Call vision model via OpenRouter
    response = call_openrouter_vision(prompt, base64_image, model)
    return response
```

### PDF Processing
- Implement PDF image extraction using PyMuPDF or similar
- Add image quality assessment and filtering
- Implement figure classification (chart, diagram, photo, etc.)
