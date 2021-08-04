import * as core from '@actions/core';

export const GITHUB_TOKEN = core.getInput('github-token');
export const MATTERMOST_WEBHOOK_URL = core.getInput('mattermost-webhook');
