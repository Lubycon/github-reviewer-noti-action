import { WebClient } from '@slack/web-api';
import { SLACK_BOT_TOKEN } from './input';
import { Developer } from '../models/developer';

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export function sendMessage({ channel, text }: { channel: string; text: string }) {
  return slackClient.chat.postMessage({
    channel,
    text,
  });
}

export function createSlackMention(developer: Pick<Developer, 'slackUserId'>) {
  return `<@${developer.slackUserId}>`;
}

export function createReviewRequestMessage(reviewers: Developer[], opener?: Developer) {
  return `${reviewers
    .map(reviewer => (reviewer ? `${createSlackMention(reviewer)}님` : null))
    .filter(v => v != null)
    .join(',')} 리뷰 부탁드려요.\n\n${opener?.name}님이 리뷰를 요청했어요! 👀`;
}
