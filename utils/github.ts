import * as github from '@actions/github';

export function isReadyCodeReview() {
  const { eventName, payload } = github.context;
  const isPullReqeustEvent = eventName === 'pull_request';
  const isReadyForReview = payload.action === 'opened' || payload.action === 'ready_for_review';

  return isPullReqeustEvent && isReadyForReview;
}

export function getReviewers() {
  const { pull_request } = github.context.payload;
  return pull_request?.requested_reviewers.map(user => {
    console.log(user);
    return user.login;
  });
}
