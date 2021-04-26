import { Developer } from './developer';

export interface GithubPullRequest {
  title: string;
  body: string;
  link: string;
  reviewers: Developer[];
  opener: Developer;
  repository: string;
}
