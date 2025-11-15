#!/bin/bash
cd /home/kavia/workspace/code-generation/crm-application-10-41198-6831/BackendApplicationServer
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

