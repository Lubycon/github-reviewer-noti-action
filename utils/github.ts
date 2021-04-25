import * as github from '@actions/github';

export function isReadyCodeReview() {
  const { eventName, payload } = github.context;
  console.log(eventName);
  console.log(payload.action);
  const isPullReqeustEvent = eventName === 'pull_request';
  const isReadyForReview = payload.action === 'opened' || payload.action === 'ready_for_review';

  return isPullReqeustEvent && isReadyForReview;
}

export function getReviewers() {
  const { pull_request } = github.context.payload;
  return pull_request?.requested_reviewers.map((user: any) => {
    console.log(user);
    return user.login;
  });
}
