import * as github from '@actions/github';
import { Developer } from 'models/developer';
import {
  RawGithubUser,
  RawGithubPullRequestReview,
  GithubPullRequest,
  GithubPullRequestReview,
  GithubPullRequestComment,
  RawGithubPullRequestComment,
} from 'models/github';
import { fetchDevelopers, findDeveloperByGithubUser } from 'utils/user';
import { getCodeOwners, getRepositoryName } from './repositories';

export async function getPullRequestOwner() {
  const { pull_request } = github.context.payload;
  const developers = await fetchDevelopers();
  const owner = pull_request?.user as RawGithubUser;
  return (
    findDeveloperByGithubUser(developers, owner.login) ?? {
      name: owner.login,
      slackUserId: '',
      githubUserName: owner.login,
    }
  );
}

export async function getAssignedPullRequestReviewers() {
  const developers = await fetchDevelopers();
  const { pull_request } = github.context.payload;
  const codeOwners = await getCodeOwners();
  const prReviewers: RawGithubUser[] = pull_request?.requested_reviewers;

  const reviewers = codeOwners.length > 0 ? codeOwners : prReviewers.map(reviewer => reviewer.login);

  return reviewers
    .map(user => findDeveloperByGithubUser(developers, user))
    .filter<Developer>((user): user is Developer => user != null);
}

export function getRawPullReuqestReview() {
  return github.context.payload.review as RawGithubPullRequestReview;
}

export function getRawPullRequestComment() {
  return github.context.payload.comment as RawGithubPullRequestComment;
}

export async function getDeveloperFromGithubUser(user: RawGithubUser) {
  const developers = await fetchDevelopers();
  const rawGithubUserName = user.login;
  return (
    findDeveloperByGithubUser(developers, rawGithubUserName) ?? {
      name: rawGithubUserName,
      slackUserId: '',
      githubUserName: rawGithubUserName,
    }
  );
}

export async function getPullRequest(): Promise<GithubPullRequest> {
  const { pull_request } = github.context.payload;
  const reviewers = await getAssignedPullRequestReviewers();
  const owner = await getPullRequestOwner();
  const repository = getRepositoryName() ?? '';

  return {
    title: (pull_request?.title ?? '') as string,
    body: pull_request?.body ?? '',
    link: (pull_request?._links.html.href ?? '') as string,
    reviewers,
    owner,
    repository,
  };
}

export async function getPullRequestComment(): Promise<GithubPullRequestComment> {
  const comment = getRawPullRequestComment();
  const author = await getDeveloperFromGithubUser(comment.user);

  return {
    author,
    message: comment.body,
  };
}

export async function getPullRequestReview(): Promise<GithubPullRequestReview> {
  const review = getRawPullReuqestReview();
  const author = await getDeveloperFromGithubUser(review.user);

  return {
    author,
    message: review.body,
    state: review.state,
  };
}
