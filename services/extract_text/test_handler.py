import pytest
from unittest.mock import patch
from handler import handler

@patch('boto3.client')
def test_handler_success(mock_boto3):
    event = {'job_id': 'test-job-123'}
    
    result = handler(event, {})
    
    assert result['statusCode'] == 200
    assert result['job_id'] == 'test-job-123'
    assert 'extracted_text' in result
    assert len(result['extracted_text']['chapters']) == 3
    assert result['extracted_text']['total_words'] == 15000
    assert result['next_stage'] == 'extract_figures'
