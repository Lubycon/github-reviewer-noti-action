import * as core from '@actions/core';
import { TARGET_SLACK_CHANNEL_ID } from './utils/input';
import { sendMessage, createReviewRequestMessage } from './utils/slack';
import { getPullRequestOpener, getPullRequestReviewers, isReadyCodeReview } from './utils/github';

async function main() {
  if (!isReadyCodeReview()) {
    return;
  }

  try {
    const reviewers = getPullRequestReviewers();
    const opener = getPullRequestOpener();
    const message = createReviewRequestMessage(reviewers, opener);

    sendMessage({ channel: TARGET_SLACK_CHANNEL_ID, text: message });
  } catch (e) {
    core.setFailed(e.message);
  }
}

main();
