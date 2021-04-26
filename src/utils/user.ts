import developers from '../data/developers.json';
import { Developer } from '../models/developer';

export function findSlackUserByGithubUser(githubUserName: string) {
  const targets = developers as Developer[];
  return targets.find(user => user.githubUserName === githubUserName);
}

export function isValidUser(slackUserId: string) {
  return developers.find(developer => developer.slackUserId === slackUserId) != null;
}
