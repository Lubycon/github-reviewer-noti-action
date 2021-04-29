import { Developer } from '../models/developer';

export async function fetchDevelopers(): Promise<Developer[]> {
  const response = await fetch('https://assets.lubycon.io/data/developers.json');
  return response.json();
}

export function findSlackUserByGithubUser(developers: Developer[], githubUserName: string) {
  return developers.find(user => user.githubUserName === githubUserName);
}
