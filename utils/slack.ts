import { WebClient } from '@slack/web-api';
import { SLACK_BOT_TOKEN } from './input';

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export function sendMessage({ channel, text }: { channel: string; text: string }) {
  return slackClient.chat.postMessage({
    channel,
    text,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text,
        },
      },
    ],
  });
}
