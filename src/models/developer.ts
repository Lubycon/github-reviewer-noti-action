export interface Developer {
  name: string;
  githubUserName: string;
  slackUserId: string;
  isExternalUser?: true;
  mattermostUserName?: string;
}
