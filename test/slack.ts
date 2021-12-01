import { User } from 'models/developer';
import {
  sendPullRequestCommentSlackMessage,
  sendPullRequestReviewSlackMessage,
  sendReviewApprovedSlackMessage,
} from '../src/utils/slack';

const Evan: User = {
  githubUserName: 'evan-moon',
  email: 'bboydart91@gmail.com',
  slackUserId: '',
};

const main = async () => {
  try {
    await sendPullRequestReviewSlackMessage({
      title: '테스트 PR입니다',
      body: '테스트테스트',
      link: 'https://lubycon.io',
      reviewers: [Evan],
      owner: Evan,
      repository: 'test-repository',
    });
    await sendReviewApprovedSlackMessage({
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
    await sendPullRequestCommentSlackMessage({
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
