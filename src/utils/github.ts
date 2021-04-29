import * as core from '@actions/core';
import * as github from '@actions/github';
import { GithubPullRequest } from '../models/github';
import { Developer, GithubUser } from '../models/developer';
import { fetchDevelopers, findSlackUserByGithubUser } from './user';

export function isReadyCodeReview() {
  const { eventName, payload } = github.context;
  const isPullReqeustEvent = eventName === 'pull_request';
  const isReadyForReview = payload.action === 'opened' || payload.action === 'ready_for_review';

  return isPullReqeustEvent && isReadyForReview;
}

export async function getPullRequestReviewers() {
  const developers = await fetchDevelopers();
  const { pull_request } = github.context.payload;
  const reviewers: GithubUser[] = pull_request?.requested_reviewers;

  core.info(`PR 리뷰어는 깃허브 아이디 ${reviewers.map(reviewer => reviewer.login).join(',')} 입니다`);

  return reviewers
    .map(user => findSlackUserByGithubUser(developers, user.login))
    .filter<Developer>((user): user is Developer => user != null);
}

export async function getPullRequestOpener() {
  const developers = await fetchDevelopers();
  const sender = github.context.payload.sender as GithubUser;
  return (
    findSlackUserByGithubUser(developers, sender.login) ?? {
      name: sender.login,
      slackUserId: '',
      githubUserName: sender.login,
    }
  );
}

export function getRepositoryName() {
  const { repository } = github.context.payload;
  return repository?.name;
}

export async function getPullRequest(): Promise<GithubPullRequest> {
  const { pull_request } = github.context.payload;
  const reviewers = await getPullRequestReviewers();
  const opener = await getPullRequestOpener();
  const repository = getRepositoryName() ?? '';

  core.info(`PR 생성자: ${opener.name}`);
  core.info(`PR 리뷰어: ${reviewers.map(reviewer => reviewer.name).join(',')}`);

  return {
    title: (pull_request?.title ?? '') as string,
    body: pull_request?.body ?? '',
    link: (pull_request?._links.html.href ?? '') as string,
    reviewers,
    opener,
    repository,
  };
}
