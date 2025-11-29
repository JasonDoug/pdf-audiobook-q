You are Amazon Q (AI developer). Build a PDF -> Audiobook pipeline using AWS serverless services.

OBJECTIVE:
- Convert academic PDFs into a set of beat-level spoken MP3s.
- Use Step Functions for orchestration, Lambdas for microtasks, S3 for storage, DynamoDB for job metadata, and API Gateway for public endpoints.
- Integrate OpenRouter (or Bedrock) for LLM calls and a pluggable TTS adapter (ElevenLabs/AWS/Google).

HIGH-LEVEL REQUIREMENTS:
- Use CDK (TypeScript) by default; implement Terraform if requested.
- Provide Step Functions ASL in `infra/step_functions/orchestrator.asl.json`.
- Generate Lambda code under `services/*` as independent packages with tests.
- Provide a React frontend skeleton under `frontend/` with instructions to run locally.
- CI: create GitHub Actions for lint/test/build and infra plan/apply (apply gated by human approval).
- All secrets (API keys) must be referenced via AWS Secrets Manager — do not hardcode keys into code.
- Provide a minimal sample dataset (3 small PDFs) for E2E testing and expected outputs.

TASK EXECUTION ORDER (run these tasks in sequence):
1) scaffold_infra
2) build_lambdas
3) build_frontend
4) ci_cd
5) docs_and_tests

OUTPUT EXPECTATIONS (for each task):
- A clear PR branch with file diffs
- README explaining how to run locally and deploy
- Unit tests (pytest for Python Lambdas or jest for TypeScript)
- A smoke test script that verifies: upload -> parse -> beats -> approval -> generate -> tts -> audio in S3

SAFETY & COST CONTROLS:
- Create resource tags and a `cost-center` tag.
- Put a daily LLM cost cap environment variable default (e.g., $50).
- All terraform/cdk `apply` must be manual-approved via GitHub Actions.

VALIDATION CHECKS:
- terraform/cdk plan should succeed (or CDK synth)
- Step Function definition must be JSON-parseable
- Each Lambda package must have a unit test passing locally
- Frontend should start with `npm start` without errors

Start with `scaffold_infra`. After each subtask, produce a short progress report describing what was changed and test results. If any step requires choices (e.g. TTS provider first), prefer defaults: CDK + ElevenLabs + OpenRouter. Ask only if a decision will materially affect the architecture.

End of instructions.
