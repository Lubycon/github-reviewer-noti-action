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

type GithubReviewCommentState = 'approved' | 'commented';

export interface RawGithubReviewComment {
  author_association: string;
  body: string;
  commit_id: string;
  html_url: string;
  id: number;
  node_id: string;
  pull_request_url: string;
  state: GithubReviewCommentState;
  submitted_at: string;
  user: RawGithubUser;
}

export interface GithubPullRequest {
  title: string;
  body: string;
  link: string;
  reviewers: Developer[];
  opener: Developer;
  repository: string;
}

export interface GithubReviewComment {
  reviewer: Developer;
  state: GithubReviewCommentState;
}
