import fetch from 'node-fetch';
import { LubyconUser } from '../models/developer';
import { createMattermostMention } from './mattermost';

export async function fetchDevelopers(): Promise<LubyconUser[]> {
  const response = await fetch('https://assets.lubycon.io/data/lubyconUsers-v2.json');
  const lubyconUsers = (await response.json()) as LubyconUser[];
  const developers = lubyconUsers.filter(user => user.role.includes('Engineer'));

  return developers;
}

export function getDeveloperByGithubUser(developers: LubyconUser[], githubUserName: string) {
  return (
    developers.find(user => user.githubUserName === githubUserName) ?? {
      name: githubUserName,
      githubUserName: githubUserName,
      email: `${githubUserName}@dummy.io`,
      role: '',
      chapters: [],
      teams: [],
    }
  );
}

export function hasMentionInMessage(message: string) {
  const words = message.split(/\s/);
  return words.filter(word => word.includes('@')).length > 0;
}

async function replaceGithubUserInString(message: string, replacer: (developer: LubyconUser) => string) {
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

export async function replaceGithubUserToMattermostUserInString(message: string) {
  return replaceGithubUserInString(message, createMattermostMention);
}
