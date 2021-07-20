import fetch from 'node-fetch';
import { MATTERMOST_HOST } from './input';
import { Developer } from '../models/developer';
import { GithubPullRequest, GithubPullRequestReview } from '../models/github';
import { MattermostMessageAttachment, MattermostMessageParams } from 'models/mattermost';

export function createMattermostMention(developer: Developer) {
  return developer.isExternalUser === true
    ? developer.githubUserName
    : `<@${developer.mattermostUserName ?? developer.githubUserName}>`;
}

export function sendMessage(args: MattermostMessageParams) {
  return fetch(MATTERMOST_HOST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: args.text,
    }),
  });
}

export function sendMattermostMessageReviewApprovedMessage({
  pullRequest: { repository, link, title, owner },
  review: { author },
}: {
  pullRequest: GithubPullRequest;
  review: GithubPullRequestReview;
}) {
  const attachments: MattermostMessageAttachment = {
    fallback: `${repository}의 Pull Request가 승인되었어요.`,
    title: 'Pull Request가 승인되었어요! :white_check_mark:',
    text: `
      *${repository}* < [${title}](${link})

      ---

      ${createMattermostMention(author)}님이 ${createMattermostMention(
      owner
    )}님의 Pull Request를 승인했어요. 이제 머지하러가볼까요?
    `,
    actions: [
      {
        id: 'mergePullRequest',
        name: '머지하러가기 :partymerge:',
        integration: {
          url: link,
        },
      },
    ],
  };

  return sendMessage({ attachments: [attachments] });
}

export function sendMattermostMessagePullRequestReviewMessage({
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

  const attachments: MattermostMessageAttachment = {
    fallback: `${repository}의 새로운 Pull Request가 오픈되었어요 :eyes:`,
    title: '새로운 Pull Request가 오픈되었어요 :eyes:',
    text: `
      *${repository}* > [${title}](${link})

      ---

      ${createMattermostMention(
        owner
      )}님이 ${reviewerNames}께 리뷰를 요청했어요\n메이트가 리뷰로 인해 작업 진행을 못 하는 일이 없도록, 되도록이면 하루가 지나기 전에 리뷰를 부탁드려요!
    `,
    actions: [
      {
        id: 'reviewPullRequest',
        name: '지금 리뷰하기 :fire:',
        integration: {
          url: link,
        },
      },
    ],
  };

  return sendMessage({ attachments: [attachments] });
}

// export async function sendGithubPullRequestCommentMessage({
//   pullRequest: { repository, link, title },
//   comment,
// }: {
//   pullRequest: GithubPullRequest;
//   comment: GithubPullRequestComment;
// }) {
//   const attachments: MattermostMessageAttachment = {
//     fallback: `${repository}의 Pull Request에 새로운 댓글이 달렸어요`,
//     title: 'Pull Request에 새로운 댓글이 달렸어요',
//     text: `
//       *${repository}* > [${title}](${link})

//       ---

//       ${await replaceGithubUserToSlackUserInString(comment.message)}
//     `,
//   };

//   return sendMessage({ attachments: [attachments] });
// }
