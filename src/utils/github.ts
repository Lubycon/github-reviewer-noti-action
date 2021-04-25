import * as github from '@actions/github';
import { Developer, GithubUser } from '../models/developer';
import { findSlackUserByGithubUser } from './user';

export function isReadyCodeReview() {
  const { eventName, payload } = github.context;
  const isPullReqeustEvent = eventName === 'pull_request';
  const isReadyForReview = payload.action === 'opened' || payload.action === 'ready_for_review';

  return isPullReqeustEvent && isReadyForReview;
}

export function getPullRequestReviewers() {
  const { pull_request } = github.context.payload;
  const reviewers: GithubUser[] = pull_request?.requested_reviewers;
  return reviewers
    .map(user => findSlackUserByGithubUser(user.login))
    .filter<Developer>((user): user is Developer => user != null);
}

export function getPullRequestOpener() {
  const sender = github.context.payload.sender as GithubUser;
  return findSlackUserByGithubUser(sender.login);
}
