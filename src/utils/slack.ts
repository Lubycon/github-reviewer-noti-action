import { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import { SLACK_BOT_TOKEN, TARGET_SLACK_CHANNEL_ID } from './input';
import { Developer } from '../models/developer';
import { GithubPullRequest, GithubPullRequestComment, GithubPullRequestReview } from '../models/github';
import { replaceGithubUserToSlackUserInString } from './user';

const slackClient = new WebClient(SLACK_BOT_TOKEN);

export function createSlackMention(developer: Developer) {
  return `<@${developer.slackUserId}>`;
}

export function sendMessage(args: ChatPostMessageArguments) {
  return slackClient.chat.postMessage(args);
}

export function sendMessageReviewApprovedMessage({
  pullRequest: { repository, link, title, owner },
  review: { author },
}: {
  pullRequest: GithubPullRequest;
  review: GithubPullRequestReview;
}) {
  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Pull Request가 승인되었어요! :white_check_mark:',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${repository}* < <${link}|${title}>`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${createSlackMention(author)}님이 ${createSlackMention(
          owner
        )}님의 Pull Request를 승인했어요. 이제 머지하러가볼까요?`,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '머지하러가기 :partymerge:',
            emoji: true,
          },
          style: 'primary',
          url: link,
        },
      ],
    },
  ];

  return sendMessage({
    channel: TARGET_SLACK_CHANNEL_ID,
    text: '',
    blocks,
  });
}

export function sendMessagePullRequestReviewMessage({ reviewers, repository, owner, link, title }: GithubPullRequest) {
  const reviewerNames = reviewers
    .map(reviewer => (reviewer ? `${createSlackMention(reviewer)}님` : null))
    .filter(v => v != null)
    .join(',');

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '새로운 Pull Request가 오픈되었어요 :eyes:',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${repository}* > <${link}|${title}>`,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${createSlackMention(
          owner
        )}님이 ${reviewerNames}께 리뷰를 요청했어요\n메이트가 리뷰로 인해 작업 진행을 못 하는 일이 없도록, 되도록이면 하루가 지나기 전에 리뷰를 부탁드려요!`,
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
          url: link,
        },
      ],
    },
  ];

  return sendMessage({
    channel: TARGET_SLACK_CHANNEL_ID,
    text: '',
    blocks,
  });
}

export async function sendGithubPullRequestCommentMessage({
  pullRequest: { repository, link, title },
  comment,
}: {
  pullRequest: GithubPullRequest;
  comment: GithubPullRequestComment;
}) {
  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${repository}* > <${link}|${title}> 풀리퀘스트에 새로운 댓글이 달렸어요`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: await replaceGithubUserToSlackUserInString(comment.message),
      },
    },
  ];

  return sendMessage({
    channel: TARGET_SLACK_CHANNEL_ID,
    text: '',
    blocks,
  });
}
