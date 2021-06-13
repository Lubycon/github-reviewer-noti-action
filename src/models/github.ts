import { Developer } from './developer';

export interface RawGithubUser {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: 'User';
  url: string;
}

type GithubPullRequestReviewState = 'approved' | 'commented';

export interface RawGithubPullRequestComment {
  author_association: string;
  body: string;
  commit_id: string;
  html_url: string;
  id: number;
  node_id: string;
  pull_request_url: string;
  submitted_at: string;
  user: RawGithubUser;
}

export interface RawGithubPullRequestReview extends RawGithubPullRequestComment {
  state: GithubPullRequestReviewState;
}

export interface GithubPullRequest {
  title: string;
  body: string;
  link: string;
  reviewers: Developer[];
  owner: Developer;
  repository: string;
}

export interface GithubPullRequestComment {
  author: Developer;
  message: string;
}

export interface GithubPullRequestReview extends GithubPullRequestComment {
  state: GithubPullRequestReviewState;
}

export enum GithubActionEventName {
  PR열림 = 'CREATED_PULL_REQUEST',
  PR머지승인 = 'APPROVED_PULL_REQUEST',
  PR리뷰코멘트 = 'REVIEW_COMMENTED_PULL_REQUEST',
  PR댓글 = 'COMMENTED_PULL_REQUEST',
}

export interface GithubActionEvent {
  type: GithubActionEventName;
}
