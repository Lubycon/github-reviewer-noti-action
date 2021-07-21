import {
  sendPullRequestCommentMattermostMessage,
  sendPullRequestReviewMattermostMessage,
} from '../src/utils/mattermost';

const main = async () => {
  try {
    await sendPullRequestReviewMattermostMessage({
      title: '테스트 PR입니다',
      body: '테스트테스트',
      link: 'https://lubycon.io',
      reviewers: [
        {
          name: '문동욱',
          githubUserName: 'evan-moon',
          slackUserId: 'U01810LSJ0L',
          mattermostUserName: 'evan',
        },
      ],
      owner: {
        name: '문동욱',
        githubUserName: 'evan-moon',
        slackUserId: 'U01810LSJ0L',
        mattermostUserName: 'evan',
      },
      repository: 'test-repository',
    });
    await sendPullRequestCommentMattermostMessage({
      pullRequest: {
        title: '테스트 PR입니다',
        body: '테스트테스트',
        link: 'https://lubycon.io',
        reviewers: [
          {
            name: '문동욱',
            githubUserName: 'evan-moon',
            slackUserId: 'U01810LSJ0L',
            mattermostUserName: 'evan',
          },
        ],
        owner: {
          name: '문동욱',
          githubUserName: 'evan-moon',
          slackUserId: 'U01810LSJ0L',
          mattermostUserName: 'evan',
        },
        repository: 'test-repository',
      },
      comment: {
        author: {
          name: '문동욱',
          githubUserName: 'evan-moon',
          slackUserId: 'U01810LSJ0L',
          mattermostUserName: 'evan',
        },
        message: '안녕하세요. @evan-moon.',
      },
    });
    console.log('Finished');
  } catch (e) {
    throw e;
  }
};

main();
