import { readFile } from 'utils/file';
import path from 'path';
import { CODEOWNERS_PATH } from 'constants/github';
import * as github from '@actions/github';
import { getPullRequestOwner } from './pullRequests';

export async function getCodeOwners() {
  const filePath = path.join(process.env.GITHUB_WORKSPACE ?? './', CODEOWNERS_PATH);
  const pullRequestOwner = getPullRequestOwner();
  try {
    const contents = await readFile(filePath);
    const codeOwners = contents
      .replace(/\*\s/, '')
      .split(/\s/)
      .map(member => member.replace('@', ''))
      .filter(owner => owner !== pullRequestOwner.githubUserName);
    return codeOwners;
  } catch {
    return [];
  }
}

export function getRepositoryName() {
  const { repository } = github.context.payload;
  return repository?.name;
}
