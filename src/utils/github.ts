import * as core from '@actions/core';
import * as github from '@actions/github';
import path from 'path';
import { GithubPullRequest, GithubReviewComment, RawGithubReviewComment } from '../models/github';
import { Developer } from '../models/developer';
import { RawGithubUser } from '../models/github';
import { fetchDevelopers, findDeveloperByGithubUser } from './user';
import { readFile } from './file';
import { CODEOWNERS_PATH } from '../constants/github';

export function isReadyCodeReview() {
  const { eventName, payload } = github.context;
  const isPullReqeustEvent = eventName === 'pull_request';
  const isReadyForReview =
    payload.action === 'opened' || payload.action === 'reopened' || payload.action === 'ready_for_review';

  return isPullReqeustEvent && isReadyForReview;
}

export function isApprovedCodeReview() {
  const { eventName, payload } = github.context;
  const isReviewEvent = eventName === 'pull_request_review';
  return isReviewEvent && payload.action === 'submitted' && payload.review.state === 'approved';
}

async function getCodeOwners() {
  const filePath = path.join(process.env.GITHUB_WORKSPACE ?? './', CODEOWNERS_PATH);
  const opener = await getPullRequestOpener();
  try {
    const contents = await readFile(filePath);
    const owners = contents
      .replace(/\*\s/, '')
      .split(/\s/)
      .map(member => member.replace('@', ''))
      .filter(owner => owner !== opener.githubUserName);
    return owners;
  } catch {
    return [];
  }
}

async function getAssignedPullRequestReviewers() {
  const developers = await fetchDevelopers();
  const { pull_request } = github.context.payload;
  const codeOwners = await getCodeOwners();
  const prReviewers: RawGithubUser[] = pull_request?.requested_reviewers;

  const reviewers = codeOwners.length > 0 ? codeOwners : prReviewers.map(reviewer => reviewer.login);

  core.info(`코드오너는 ${codeOwners.join(',')}입니다`);
  core.info(`PR에 입력된 리뷰어는 ${prReviewers.join(',')} 입니다`);

  return reviewers
    .map(user => findDeveloperByGithubUser(developers, user))
    .filter<Developer>((user): user is Developer => user != null);
}

async function getPullRequestOpener() {
  const developers = await fetchDevelopers();
  const sender = github.context.payload.sender as RawGithubUser;
  return (
    findDeveloperByGithubUser(developers, sender.login) ?? {
      name: sender.login,
      slackUserId: '',
      githubUserName: sender.login,
    }
  );
}

function getPullReuqestReviewComment() {
  return github.context.payload.review as RawGithubReviewComment;
}

async function getPullRequestReviewCommentOwner() {
  const developers = await fetchDevelopers();
  const rawReview = getPullReuqestReviewComment();
  const rawGithubUser = rawReview.user.login;
  return (
    findDeveloperByGithubUser(developers, rawGithubUser) ?? {
      name: rawGithubUser,
      slackUserId: '',
      githubUserName: rawGithubUser,
    }
  );
}

function getRepositoryName() {
  const { repository } = github.context.payload;
  return repository?.name;
}

export async function getPullRequest(): Promise<GithubPullRequest> {
  const { pull_request } = github.context.payload;
  const reviewers = await getAssignedPullRequestReviewers();
  const opener = await getPullRequestOpener();
  const repository = getRepositoryName() ?? '';

  core.info(`PR 생성자는 ${opener.name} 입니다`);
  core.info(`🔥 최종 PR 리뷰어는 ${reviewers.map(reviewer => reviewer.name).join(',')} 입니다.`);

  return {
    title: (pull_request?.title ?? '') as string,
    body: pull_request?.body ?? '',
    link: (pull_request?._links.html.href ?? '') as string,
    reviewers,
    opener,
    repository,
  };
}

export async function getReviewComment(): Promise<GithubReviewComment> {
  const comment = getPullReuqestReviewComment();
  const reviewer = await getPullRequestReviewCommentOwner();

  core.info(`${reviewer.name}님의 Approve를 감지했습니다`);

  return {
    reviewer,
    state: comment.state,
  };
}
