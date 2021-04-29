module.exports = {
  branches: ['main'],
  repositoryUrl: 'https://github.com/Lubycon/lubycon-github-reviewer-slack-noti-action',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
        preset: 'angular',
        releaseRules: [
          {
            release: 'minor',
            type: 'feat',
          },
          {
            release: 'patch',
            type: 'fix',
          },
          {
            release: 'patch',
            type: 'chore',
          },
          {
            release: 'patch',
            type: 'docs',
          },
          {
            release: 'patch',
            type: 'style',
          },
          {
            release: 'patch',
            type: 'refactor',
          },
          {
            release: 'patch',
            type: 'perf',
          },
          {
            release: 'patch',
            type: 'test',
          },
          {
            release: 'minor',
            type: 'build',
          },
          {
            release: 'patch',
            type: 'ci',
          },
          {
            release: 'minor',
            type: 'revert',
          },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'README.md', 'package.json', 'yarn.lock'],
        message:
          "Release <%= nextRelease.version %> - <%= new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'America/Denver', timeZoneName: 'short'}) %> [skip ci]\n\n<%= nextRelease.notes %>",
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: ['CHANGELOG.md', 'README.md', 'package.json', 'yarn.lock'],
      },
    ],
  ],
};
