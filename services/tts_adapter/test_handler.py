import pytest
from unittest.mock import patch, MagicMock
from handler import handler

@patch('boto3.client')
def test_handler_success(mock_boto3):
    mock_polly = MagicMock()
    mock_boto3.return_value = mock_polly
    
    event = {'job_id': 'test-job-123'}
    
    result = handler(event, {})
    
    assert result['statusCode'] == 200
    assert result['job_id'] == 'test-job-123'
    assert len(result['audio_files']) == 3
    assert result['total_duration_seconds'] == 1380
    assert result['total_size_mb'] == 16.1
    assert result['next_stage'] == 'finalize'
