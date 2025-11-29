import json
import logging
from typing import Dict, Any

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """Extract figures and images from PDF"""
    logger.info(f"Extract figures event: {json.dumps(event)}")
    
    job_id = event.get('job_id', 'job-123')
    
    return {
        'statusCode': 200,
        'job_id': job_id,
        'figures': [
            {
                'id': 'fig-1',
                'type': 'chart',
                'page': 5,
                's3_key': 'figures/fig-1.png',
                'description': 'Sales growth chart'
            },
            {
                'id': 'fig-2', 
                'type': 'diagram',
                'page': 12,
                's3_key': 'figures/fig-2.png',
                'description': 'System architecture diagram'
            }
        ],
        'next_stage': 'create_beats'
    }
