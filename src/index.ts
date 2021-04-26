import * as core from '@actions/core';
import { createPullRequestReviewMessage, sendMessagePullRequestReviewMessage } from './utils/slack';
import { getPullRequest, isReadyCodeReview } from './utils/github';
import { MY_SLACK_USER_ID } from './utils/input';
import { isValidUser } from './utils/user';

async function main() {
  if (!isValidUser(MY_SLACK_USER_ID)) {
    core.setFailed('루비콘 허브 슬랙 워크스페이스에 속한 유저 아이디가 아닙니다');
    return;
  }

  if (!isReadyCodeReview()) {
    return;
  }

  try {
    const pullRequest = getPullRequest();
    const message = createPullRequestReviewMessage(pullRequest);
    sendMessagePullRequestReviewMessage(message);
  } catch (e) {
    core.setFailed(e.message);
  }
}

main();
