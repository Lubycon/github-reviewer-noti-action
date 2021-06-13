import * as github from '@actions/github';
import { GithubActionEvent, GithubActionEventName } from 'models/github';

function isReadyCodeReview() {
  const { eventName, payload } = github.context;
  const isPullReqeustEvent = eventName === 'pull_request';
  const isReadyForReview =
    payload.action === 'opened' || payload.action === 'reopened' || payload.action === 'ready_for_review';

  return isPullReqeustEvent && isReadyForReview;
}

function isApprovedCodeReview() {
  const { eventName, payload } = github.context;
  const isReviewEvent = eventName === 'pull_request_review';
  return isReviewEvent && payload.action === 'submitted' && payload.review.state === 'approved';
}

function isCodeReview() {
  const { eventName, payload } = github.context;
  const isReviewEvent = eventName === 'pull_request_review';
  return isReviewEvent && payload.action === 'submitted' && payload.review.state === 'commented';
}

function isCreatedPullRequestComment() {
  const { eventName, payload } = github.context;
  const isPullRequestCommentEvent = eventName === 'pull_request_review_comment';
  return isPullRequestCommentEvent && payload.action === 'created';
}

export function parseGithubEvent(): GithubActionEvent | null {
  if (isReadyCodeReview()) {
    return {
      type: GithubActionEventName.PR열림,
    };
  } else if (isApprovedCodeReview()) {
    return {
      type: GithubActionEventName.PR머지승인,
    };
  } else if (isCodeReview()) {
    return {
      type: GithubActionEventName.PR리뷰코멘트,
    };
  } else if (isCreatedPullRequestComment()) {
    return {
      type: GithubActionEventName.PR댓글,
    };
  }

  return null;
}
