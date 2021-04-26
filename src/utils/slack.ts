import { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import { SLACK_BOT_TOKEN, TARGET_SLACK_CHANNEL_ID } from './input';
import { Developer } from '../models/developer';
import { GithubPullRequest } from '../models/github';

interface ReviewRequestMessageArguments {
  title: string;
  contents: string;
  repositoryName: string;
  pullRequestTitle: string;
  pullRequestLink: string;
}

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export function createSlackMention(developer: Developer) {
  return `<@${developer.slackUserId}>`;
}

export function createPullRequestReviewMessage({
  reviewers,
  repository,
  opener,
  link,
  title,
}: GithubPullRequest): ReviewRequestMessageArguments {
  const reviewerNames = reviewers
    .map(reviewer => (reviewer ? `${createSlackMention(reviewer)}님` : null))
    .filter(v => v != null)
    .join(',');

  return {
    title: `새로운 Pull Request가 오픈되었어요 :eyes:`,
    contents: `${createSlackMention(
      opener
    )}님이 ${reviewerNames}께 리뷰를 요청했어요\n메이트가 리뷰로 인해 작업 진행을 못 하는 일이 없도록, 되도록이면 하루가 지나기 전에 리뷰를 부탁드려요!`,
    repositoryName: repository,
    pullRequestTitle: title,
    pullRequestLink: link,
  };
}

export function sendMessage(args: ChatPostMessageArguments) {
  return slackClient.chat.postMessage(args);
}

export function sendMessagePullRequestReviewMessage({
  title,
  contents,
  repositoryName,
  pullRequestTitle,
  pullRequestLink,
}: ReviewRequestMessageArguments) {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: title,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${repositoryName}* < <${pullRequestLink}|${pullRequestTitle}>`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: contents,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '지금 리뷰하기 :fire:',
            emoji: true,
          },
          style: 'primary',
          url: pullRequestLink,
        },
      ],
    },
  ];

  sendMessage({
    channel: TARGET_SLACK_CHANNEL_ID,
    text: '',
    blocks,
  });
}
