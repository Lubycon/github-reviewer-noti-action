import fetch from 'node-fetch';
import { Developer } from '../models/developer';
import { createMattermostMention } from './mattermost';
import { createSlackMention } from './slack';

export async function fetchDevelopers(): Promise<Developer[]> {
  const response = await fetch('https://assets.lubycon.io/data/developers.json');
  return response.json();
}

export function getDeveloperByGithubUser(developers: Developer[], githubUserName: string) {
  return (
    developers.find(user => user.githubUserName === githubUserName) ?? {
      name: githubUserName,
      githubUserName: githubUserName,
      slackUserId: githubUserName,
      isExternalUser: true,
    }
  );
}

export function hasMentionInMessage(message: string) {
  const words = message.split(/\s/);
  return words.filter(word => word.includes('@')).length > 0;
}

async function replaceGithubUserInString(message: string, replacer: (developer: Developer) => string) {
  const words = message.split(/\s/);
  const developers = await fetchDevelopers();

  return words
    .map(message => {
      const githubUser = message.match(/@[a-z-_]+/)?.[0].replace('@', '');
      const developer = getDeveloperByGithubUser(developers, githubUser ?? '');

      return developer == null ? message : replacer(developer);
    })
    .join(' ');
}

export async function replaceGithubUserToSlackUserInString(message: string) {
  return replaceGithubUserInString(message, createSlackMention);
}

export async function replaceGithubUserToMattermostUserInString(message: string) {
  return replaceGithubUserInString(message, createMattermostMention);
}
