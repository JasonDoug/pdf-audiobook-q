import json
import logging
from typing import Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Extract text from PDF using OCR/text extraction"""
    logger.info(f"Extract text event: {json.dumps(event)}")
    
    job_id = event.get('job_id', 'job-123')
    
    return {
        'statusCode': 200,
        'job_id': job_id,
        'extracted_text': {
            'chapters': [
                {'title': 'Introduction', 'content': 'This is the introduction chapter...'},
                {'title': 'Chapter 1', 'content': 'This is chapter 1 content...'},
                {'title': 'Conclusion', 'content': 'This is the conclusion...'}
            ],
            'total_words': 15000,
            'language': 'en'
        },
        'next_stage': 'extract_figures'
    }
