import pytest
from unittest.mock import patch
from handler import handler

@patch('boto3.client')
def test_handler_success(mock_boto3):
    event = {'job_id': 'test-job-123'}
    
    result = handler(event, {})
    
    assert result['statusCode'] == 200
    assert result['job_id'] == 'test-job-123'
    assert len(result['beats']) == 3
    assert result['total_duration_minutes'] == 23
    assert result['beats'][0]['requires_approval'] == True
    assert result['next_stage'] == 'user_approval'
