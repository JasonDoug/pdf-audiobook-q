```
Task 1 — scaffold_infra

Create an AWS CDK (TypeScript) project under /infra/cdk that provisions:
- S3 bucket: pdfaudiobook-ingest-{env}
- DynamoDB table: pdfaudiobook-jobs
- IAM roles for Lambdas and Step Functions with least privilege
- A Step Functions state machine file at infra/step_functions/orchestrator.asl.json matching the pipeline: ExtractTextTask -> ExtractFiguresTask -> SemanticSegmentationTask -> BeatSynthesisTask -> UserApprovalWaitTask (Task Token) -> GenerateLectureScriptTask -> VerifyScriptsTask -> SynthesizeAudioTask -> FinalizeTask.
- API Gateway (HTTP) endpoints: POST /upload, GET /job/{id}, POST /job/{id}/beats/{beat_id}/approve
- Output the CDK synth (cloudformation template) and confirm `cdk synth` works.

Favor CDK constructs and place stacks logically: CoreStack (S3, Dynamo), LambdaStack (lambdas), OrchestrationStack (step functions).
```



```
Task 2 — build_lambdas

Create Python Lambda packages under /services with the following signatures and unit tests (pytest):
- ingest_pdf.handler(event, context)
- extract_text.handler(event, context)
- extract_figures.handler(event, context)
- create_beats.handler(event, context)
- llm_orchestrator.handler(event, context)
- verify_scripts.handler(event, context)
- tts_adapter.handler(event, context)
- finalize.handler(event, context)

Each handler should:
- accept and log an event
- perform deterministic stub behavior (for now) returning expected output shapes
- have at least one unit test that mocks boto3 and OpenRouter and asserts correct output
- include a README explaining next steps to implement LLM and vision integrations
```


```
Task 3 — build_frontend
Scaffold a React app (Vite) under /frontend that implements:
- Upload page with file input calling POST /upload (use a mock API client when backend not present)
- Beats review page: shows list of beats, allows approve/edits (inline), calls POST /job/{id}/beats/{beat_id}/approve with TaskToken
- Player page: reads job audio manifest and plays per-beat MP3 from presigned S3 links
Add simple CSS using Tailwind. Provide local run docs.
```


```
Task 4 — ci_cd
Add GitHub Actions:
- lint-and-test.yml: runs unit tests for lambdas and frontend build
- infra-plan.yml: runs `cdk synth` and produces a diff artifact
- infra-apply.yml: runs `cdk deploy` but requires manual approval action in the workflow before applying

Ensure secrets are read from GitHub Secrets (e.g., AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY).
```


```
Task 5 — docs_and_tests
Add README.md describing architecture and how to deploy locally. Add sample PDFs under /samples and a lightweight smoke-test script (Python) that:
- uploads a PDF to the API (or simulates the event)
- triggers the Step Function (or simulates)
- validates that the S3 audio output keys were created for expected beat counts (using stubbed outputs)
Document E2E test expectations and cost guardrails.
```

