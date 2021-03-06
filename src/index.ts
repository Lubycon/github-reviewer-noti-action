import * as core from '@actions/core';
import * as github from '@actions/github';
import { SUPPROTED_EVENTS } from 'constants/github';
import { getPullRequest, getPullRequestComment, getPullRequestReview } from 'utils/github/pullRequests';
import { parseGithubEvent } from 'utils/github/events';
import { GithubActionEventName } from 'models/github';
import { hasMentionInMessage } from 'utils/user';
import {
  sendPullRequestCommentSlackMessage,
  sendPullRequestReviewSlackMessage,
  sendReviewApprovedSlackMessage,
} from 'utils/slack';
import { SLACK_BOT_TOKEN } from 'utils/input';

const { eventName, payload } = github.context;

async function main() {
  core.info('๐ฅ Run.....');
  core.info(`eventName = ${eventName}`);
  core.info(`action = ${payload.action}`);
  core.info(`token = ${SLACK_BOT_TOKEN.length}`);

  if (!SUPPROTED_EVENTS.includes(eventName)) {
    core.warning(`ํ์ฌ ์ด ์ก์์ ${SUPPROTED_EVENTS.join(', ')} ์ด๋ฒคํธ๋ง ์ง์ํฉ๋๋ค.`);
    return;
  }

  const pullRequest = await getPullRequest();
  const githubEvent = parseGithubEvent();

  if (githubEvent == null) {
    return;
  }

  switch (githubEvent.type) {
    case GithubActionEventName.PR์ด๋ฆผ: {
      core.info('Pull Request ์คํ์ด ๊ฐ์ง๋์์ต๋๋ค. ๋ฉ์ธ์ง๋ฅผ ๋ณด๋๋๋ค.');
      await sendPullRequestReviewSlackMessage(pullRequest);
      break;
    }
    case GithubActionEventName.PR๋จธ์ง์น์ธ: {
      core.info('Pull Request ์น์ธ์ด ๊ฐ์ง๋์์ต๋๋ค. ๋ฉ์ธ์ง๋ฅผ ๋ณด๋๋๋ค.');
      const review = await getPullRequestReview();
      await sendReviewApprovedSlackMessage({ pullRequest, review });
      break;
    }
    case GithubActionEventName.PR๋ฆฌ๋ทฐ์ฝ๋ฉํธ: {
      const comment = await getPullRequestComment();

      if (hasMentionInMessage(comment.message)) {
        core.info('Pull Request์ ๋ฉ์์ด ํฌํจ๋ ์๋ก์ด ๋๊ธ์ด ๊ฐ์ง๋์์ต๋๋ค. ๋ฉ์ธ์ง๋ฅผ ๋ณด๋๋๋ค.');
        await sendPullRequestCommentSlackMessage({ pullRequest, comment });
      }

      break;
    }
  }

  core.info('๐ Done');
}

try {
  main();
} catch (e: any) {
  core.setFailed(e);
}
