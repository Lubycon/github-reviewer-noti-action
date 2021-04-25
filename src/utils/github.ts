import * as github from '@actions/github';
import { GithubUser } from '../models/developer';

export function isReadyCodeReview() {
  const { eventName, payload } = github.context;
  const isPullReqeustEvent = eventName === 'pull_request';
  const isReadyForReview = payload.action === 'opened' || payload.action === 'ready_for_review';

  return isPullReqeustEvent && isReadyForReview;
}

export function getReviewers(): string[] {
  const { pull_request } = github.context.payload;
  const reviewers: GithubUser[] = pull_request?.requested_reviewers;
  return reviewers.map(user => user.login);
}
