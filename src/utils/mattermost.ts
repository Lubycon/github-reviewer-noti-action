import fetch from 'node-fetch';
import { MATTERMOST_HOST } from './input';
import { Developer } from 'models/developer';
import { GithubPullRequest, GithubPullRequestComment, GithubPullRequestReview } from 'models/github';
import { MattermostMessageAttachment, MattermostMessageParams } from 'models/mattermost';
import { replaceGithubUserToMattermostUserInString } from '../utils/user';

export function createMattermostMention(developer: Developer) {
  return developer.isExternalUser === true
    ? developer.githubUserName
    : `@${developer.mattermostUserName ?? developer.githubUserName}`;
}

export function sendMessage(args: MattermostMessageParams) {
  return fetch(MATTERMOST_HOST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'PR 봇',
      icon_url: 'https://assets.lubycon.io/logo/symbol-color.svg',
      ...args,
    }),
  });
}

export function sendReviewApprovedMattermostMessage({
  pullRequest: { repository, link, title, owner },
  review: { author },
}: {
  pullRequest: GithubPullRequest;
  review: GithubPullRequestReview;
}) {
  const text = `*${repository}* < [${title}](${link})\n\n---\n\n${createMattermostMention(
    author
  )}님이 ${createMattermostMention(
    owner
  )}님의 Pull Request를 승인했어요. 이제 머지하러가볼까요?\n\n[머지하러가기 :partymerge:](${link})`;

  const attachments: MattermostMessageAttachment = {
    fallback: `${repository}의 Pull Request가 승인되었어요.`,
    title: 'Pull Request가 승인되었어요! :white_check_mark:',
    text,
  };

  return sendMessage({ attachments: [attachments] });
}

export function sendPullRequestReviewMattermostMessage({
  reviewers,
  repository,
  owner,
  link,
  title,
}: GithubPullRequest) {
  const reviewerNames = reviewers
    .map(reviewer => (reviewer ? `${createMattermostMention(reviewer)}님` : null))
    .filter(v => v != null)
    .join(',');

  const text = `*${repository}* > [${title}](${link})\n\n---\n\n${createMattermostMention(
    owner
  )}님이 ${reviewerNames}께 리뷰를 요청했어요.\n메이트가 리뷰로 인해 작업 진행을 못 하는 일이 없도록, 되도록이면 하루가 지나기 전에 리뷰를 부탁드려요!\n\n[지금 리뷰하기 :fire:](${link})`;

  const attachments: MattermostMessageAttachment = {
    fallback: `${repository}의 새로운 Pull Request가 오픈되었어요 :eyes:`,
    title: '새로운 Pull Request가 오픈되었어요 :eyes:',
    text,
  };

  return sendMessage({ attachments: [attachments] });
}

export async function sendPullRequestCommentMattermostMessage({
  pullRequest: { repository, link, title },
  comment,
}: {
  pullRequest: GithubPullRequest;
  comment: GithubPullRequestComment;
}) {
  const text = `*${repository}* > [${title}](${link})\n\n---\n\n${await replaceGithubUserToMattermostUserInString(
    comment.message
  )}`;

  const attachments: MattermostMessageAttachment = {
    fallback: `${repository}의 Pull Request에 새로운 댓글이 달렸어요`,
    title: 'Pull Request에 새로운 댓글이 달렸어요',
    text,
  };

  return sendMessage({ attachments: [attachments] });
}
