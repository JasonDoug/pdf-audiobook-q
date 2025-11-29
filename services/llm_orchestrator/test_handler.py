import pytest
from unittest.mock import patch, MagicMock
from handler import handler

@patch('requests.post')
@patch('boto3.client')
def test_handler_success(mock_boto3, mock_requests):
    mock_response = MagicMock()
    mock_response.json.return_value = {'choices': [{'message': {'content': 'Generated script'}}]}
    mock_requests.return_value = mock_response
    
    event = {'job_id': 'test-job-123'}
    
    result = handler(event, {})
    
    assert result['statusCode'] == 200
    assert result['job_id'] == 'test-job-123'
    assert len(result['scripts']) == 3
    assert result['llm_model_used'] == 'gpt-4'
    assert result['next_stage'] == 'verify_scripts'
