#!/usr/bin/env python3
"""Test that all handler files are properly structured"""

import os
import sys

def test_handler_structure():
    services = [
        'ingest_pdf', 'extract_text', 'extract_figures', 'create_beats',
        'llm_orchestrator', 'verify_scripts', 'tts_adapter', 'finalize'
    ]
    
    for service in services:
        handler_path = f'/home/jason/Projects/pdf-audiobook-q/services/{service}/handler.py'
        test_path = f'/home/jason/Projects/pdf-audiobook-q/services/{service}/test_handler.py'
        
        assert os.path.exists(handler_path), f"Missing handler: {handler_path}"
        assert os.path.exists(test_path), f"Missing test: {test_path}"
        
        # Check handler has required function
        with open(handler_path, 'r') as f:
            content = f.read()
            assert 'def handler(' in content, f"Missing handler function in {service}"
            assert 'logger.info(' in content, f"Missing logging in {service}"
        
        print(f"✅ {service}: handler and test files exist")
    
    print("All services properly structured!")

if __name__ == '__main__':
    test_handler_structure()
