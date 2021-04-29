import * as core from '@actions/core';
import { createPullRequestReviewMessage, sendMessagePullRequestReviewMessage } from './utils/slack';
import { getPullRequest, isReadyCodeReview } from './utils/github';

async function main() {
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
