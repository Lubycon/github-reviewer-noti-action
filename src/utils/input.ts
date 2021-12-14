import * as core from '@actions/core';

export const SLACK_BOT_TOKEN = core.getInput('slack-bot-token', { required: true });
export const TARGET_SLACK_CHANNEL_ID = core.getInput('slack-channel-id', { required: true });
export const SLACK_BOT_SIGNING_SECRET = core.getInput('slack-bot-signing-secret', { required: true });
export const USER_INFO_URL = core.getInput('user-info-url', { required: true });
