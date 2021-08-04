import {
  sendPullRequestCommentMattermostMessage,
  sendPullRequestReviewMattermostMessage,
  sendReviewApprovedMattermostMessage,
} from '../src/utils/mattermost';

const Evan = {
  name: '문동욱',
  githubUserName: 'evan-moon',
  email: 'bboydart91@gmail.com',
  role: 'Frontend Engineer',
  chapters: ['Frontend'],
  teams: ['Lubycon'],
};

const main = async () => {
  try {
    await sendPullRequestReviewMattermostMessage({
      title: '테스트 PR입니다',
      body: '테스트테스트',
      link: 'https://lubycon.io',
      reviewers: [Evan],
      owner: Evan,
      repository: 'test-repository',
    });
    await sendReviewApprovedMattermostMessage({
      pullRequest: {
        title: '테스트 PR입니다',
        body: '테스트테스트',
        link: 'https://lubycon.io',
        reviewers: [Evan],
        owner: Evan,
        repository: 'test-repository',
      },
      review: {
        state: 'approved',
        author: Evan,
        message: 'LGTM입니다~',
      },
    });
    await sendPullRequestCommentMattermostMessage({
      pullRequest: {
        title: '테스트 PR입니다. 코멘트 테스트',
        body: '테스트테스트',
        link: 'https://lubycon.io',
        reviewers: [Evan],
        owner: Evan,
        repository: 'test-repository',
      },
      comment: {
        author: Evan,
        message: '@evan-moon @unknown-github-user 꼭 이렇게 짜셔야 했나요?',
      },
    });
    console.log('Finished');
  } catch (e) {
    throw e;
  }
};

main();
