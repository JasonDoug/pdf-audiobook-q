import json
import logging
import boto3
from typing import Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Ingest PDF and store metadata in DynamoDB"""
    logger.info(f"Ingest PDF event: {json.dumps(event)}")
    
    # Stub behavior
    job_id = event.get('job_id', 'job-123')
    s3_key = event.get('s3_key', 'uploads/sample.pdf')
    
    return {
        'statusCode': 200,
        'job_id': job_id,
        's3_key': s3_key,
        'pdf_metadata': {
            'pages': 150,
            'size_mb': 2.5,
            'title': 'Sample PDF Document'
        },
        'next_stage': 'extract_text'
    }
