import * as core from '@actions/core';
import * as github from '@actions/github';
import { sendMessagePullRequestReviewMessage, sendMessageReviewApprovedMessage } from './utils/slack';
import { getPullRequest, getReviewComment, isApprovedCodeReview, isReadyCodeReview } from './utils/github';
import { SUPPROTED_EVENTS } from './constants/github';

const { eventName, payload } = github.context;

async function main() {
  core.info('🔥 Run.....');
  core.info(`eventName = ${eventName}`);
  core.info(`action = ${payload.action}`);

  if (!SUPPROTED_EVENTS.includes(eventName)) {
    core.warning(`현재 이 액션은 ${SUPPROTED_EVENTS.join(', ')} 이벤트만 지원합니다.`);
    return;
  }

  const pullRequest = await getPullRequest();

  if (isReadyCodeReview()) {
    core.info('Pull Request 오픈이 감지되었습니다. 슬랙 메세지를 보냅니다.');
    await sendMessagePullRequestReviewMessage(pullRequest);
  } else if (isApprovedCodeReview()) {
    core.info('Pull Request 승인이 감지되었습니다. 슬랙 메세지를 보냅니다.');
    const reviewComment = await getReviewComment();
    await sendMessageReviewApprovedMessage({ pullRequest, reviewComment });
  }

  core.info('👋 Done');
}

try {
  main();
} catch (e) {
  core.setFailed(e);
}
