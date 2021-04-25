import * as core from '@actions/core';
import { getReviewers, isReadyCodeReview } from './utils/github';

async function main() {
  try {
    if (isReadyCodeReview()) {
      console.log(getReviewers());
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

main();
