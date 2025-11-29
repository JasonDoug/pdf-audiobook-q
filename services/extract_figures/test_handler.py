import pytest
from unittest.mock import patch
from handler import handler

@patch('boto3.client')
def test_handler_success(mock_boto3):
    event = {'job_id': 'test-job-123'}
    
    result = handler(event, {})
    
    assert result['statusCode'] == 200
    assert result['job_id'] == 'test-job-123'
    assert len(result['figures']) == 2
    assert result['figures'][0]['type'] == 'chart'
    assert result['next_stage'] == 'create_beats'
