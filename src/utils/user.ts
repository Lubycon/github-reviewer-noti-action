import fetch from 'node-fetch';
import { Developer } from '../models/developer';
import { createSlackMention } from './slack';

export async function fetchDevelopers(): Promise<Developer[]> {
  const response = await fetch('https://assets.lubycon.io/data/developers.json');
  return response.json();
}

export function findDeveloperByGithubUser(developers: Developer[], githubUserName: string) {
  return developers.find(user => user.githubUserName === githubUserName);
}

export function hasMentionInMessage(message: string) {
  const words = message.split(/\s/);
  return words.filter(word => word.includes('@')).length > 0;
}

export async function replaceGithubUserToSlackUserInString(message: string) {
  const words = message.split(/\s/);
  const developers = await fetchDevelopers();

  return words
    .map(message => {
      const githubUser = message.replace('@', '');
      const developer = findDeveloperByGithubUser(developers, githubUser);

      return developer == null ? message : createSlackMention(developer);
    })
    .join(' ');
}
