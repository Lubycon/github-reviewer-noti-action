import * as core from '@actions/core';
import { TARGET_SLACK_CHANNEL_ID } from 'src/utils/input';
import { sendMessage } from 'src/utils/slack';
import { findSlackUserByGithubUser } from 'src/utils/user';
import { getReviewers, isReadyCodeReview } from './utils/github';

async function main() {
  try {
    if (isReadyCodeReview()) {
      const reviewers = getReviewers().map(findSlackUserByGithubUser);
      const message = `${reviewers
        .map(reviewer => (reviewer ? `@${reviewer.name}` : null))
        .filter(v => v != null)
        .join('님, ')} 리뷰 부탁드려요`;

      sendMessage({ channel: TARGET_SLACK_CHANNEL_ID, text: message });
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

main();
