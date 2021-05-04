import * as core from '@actions/core';
import * as github from '@actions/github';
import { createPullRequestReviewMessage, sendMessagePullRequestReviewMessage } from './utils/slack';
import { getPullRequest, isReadyCodeReview } from './utils/github';

const { eventName, payload } = github.context;

async function main() {
  core.info('🔥 Run.....');
  core.info(`eventName = ${eventName}`);
  core.info(`action = ${payload.action}`);
  core.info(`reivew = ${JSON.stringify(payload.review)}`);

  if (isReadyCodeReview()) {
    try {
      const pullRequest = await getPullRequest();
      core.info(JSON.stringify(pullRequest));
      const message = createPullRequestReviewMessage(pullRequest);
      sendMessagePullRequestReviewMessage(message);
    } catch (e) {
      core.setFailed(e.message);
    }
  }
}

main();
