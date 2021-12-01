import * as core from '@actions/core';

export const SLACK_BOT_TOKEN = core.getInput('slack-bot-token');
export const TARGET_SLACK_CHANNEL_ID = core.getInput('slack-channel-id');
export const GITHUB_TOKEN = core.getInput('github-token');
