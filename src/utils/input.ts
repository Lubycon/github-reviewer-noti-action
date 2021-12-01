import * as core from '@actions/core';

export const SLACK_BOT_TOKEN = core.getInput('slack-bot-token', { required: true });
export const TARGET_SLACK_CHANNEL_ID = core.getInput('slack-channel-id', { required: true });
