import * as core from '@actions/core';
import * as github from '@actions/github';
import { sendMessageReviewApprovedMessage, sendMessagePullRequestReviewMessage } from './utils/slack';
import { getPullRequest, getReviewComment, isApprovedCodeReview, isReadyCodeReview } from './utils/github';
import { SUPPROTED_EVENTS } from 'constants/github';

const { eventName, payload } = github.context;

async function main() {
  core.info('🔥 Run.....');
  core.info(`eventName = ${eventName}`);
  core.info(`action = ${payload.action}`);
  core.info(`reivew = ${JSON.stringify(payload.review)}`);

  if (!SUPPROTED_EVENTS.includes(eventName)) {
    core.warning(`현재 이 액션은 ${SUPPROTED_EVENTS.join(', ')} 이벤트만 지원합니다.`);
    return;
  }

  const pullRequest = await getPullRequest();

  if (isReadyCodeReview()) {
    sendMessagePullRequestReviewMessage(pullRequest);
  } else if (isApprovedCodeReview()) {
    const reviewComment = await getReviewComment();
    sendMessageReviewApprovedMessage({ pullRequest, reviewComment });
  }
}

try {
  main();
} catch (e) {
  core.setFailed(e);
}
