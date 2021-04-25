import * as core from '@actions/core';
import { TARGET_SLACK_CHANNEL_ID } from './utils/input';
import { sendMessage, createSlackMention } from './utils/slack';
import { getPullRequestOpener, getPullRequestReviewers, isReadyCodeReview } from './utils/github';

async function main() {
  if (!isReadyCodeReview()) {
    return;
  }

  try {
    const opener = getPullRequestOpener();
    const reviewers = getPullRequestReviewers();
    const message = `${reviewers
      .map(reviewer => (reviewer ? `${createSlackMention(reviewer)}님` : null))
      .filter(v => v != null)
      .join(',')} 리뷰 부탁드려요. ${opener?.name}님이 리뷰를 요청했어요! 👀`;

    sendMessage({ channel: TARGET_SLACK_CHANNEL_ID, text: message });
  } catch (e) {
    core.setFailed(e.message);
  }
}

main();
