import pytest
from unittest.mock import patch, MagicMock
from handler import handler

@patch('boto3.client')
def test_handler_success(mock_boto3):
    mock_dynamodb = MagicMock()
    mock_boto3.return_value = mock_dynamodb
    
    event = {
        'job_id': 'test-job-123',
        's3_key': 'uploads/test.pdf'
    }
    
    result = handler(event, {})
    
    assert result['statusCode'] == 200
    assert result['job_id'] == 'test-job-123'
    assert result['s3_key'] == 'uploads/test.pdf'
    assert 'pdf_metadata' in result
    assert result['next_stage'] == 'extract_text'
