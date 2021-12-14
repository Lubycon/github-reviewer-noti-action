import { User } from '../models/developer';
import { createSlackMention } from './slack';
import fetch from 'node-fetch';
import { USER_INFO_URL } from './input';

export async function fetchDevelopers() {
  const response = await fetch(USER_INFO_URL);
  return (await response.json()) as User[];
}

export function getDeveloperByGithubUser(developers: User[], githubUserName: string) {
  return (
    developers.find(user => user.githubUserName === githubUserName) ??
    ({
      githubUserName: githubUserName,
      email: `${githubUserName}@dummy.io`,
      slackUserId: githubUserName,
    } as User)
  );
}

export function hasMentionInMessage(message: string) {
  const words = message.split(/\s/);
  return words.filter(word => word.includes('@')).length > 0;
}

async function replaceGithubUserInString(message: string, replacer: (developer: User) => string) {
  const words = message.split(/\s/);
  const developers = await fetchDevelopers();

  return words
    .map(message => {
      const githubUser = message.match(/@[a-z-_]+/)?.[0].replace('@', '');
      if (githubUser == null) {
        return message;
      } else {
        const developer = getDeveloperByGithubUser(developers, githubUser ?? '');
        return replacer(developer);
      }
    })
    .join(' ');
}

export async function replaceGithubUserToSlackUserInString(message: string) {
  return replaceGithubUserInString(message, createSlackMention);
}
