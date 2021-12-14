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
  core.info('🔥 Run...');
  core.info(`eventName = ${eventName}`);
  core.info(`action = ${payload.action}`);
  core.info(`token = ${SLACK_BOT_TOKEN.length}`);

  if (!SUPPROTED_EVENTS.includes(eventName)) {
    core.warning(`현재 이 액션은 ${SUPPROTED_EVENTS.join(', ')} 이벤트만 지원합니다.`);
    return;
  }

  const pullRequest = await getPullRequest();
  const githubEvent = parseGithubEvent();

  if (githubEvent == null) {
    return;
  }

  switch (githubEvent.type) {
    case GithubActionEventName.PR열림: {
      core.info('Pull Request 오픈이 감지되었습니다. 메세지를 보냅니다.');
      await sendPullRequestReviewSlackMessage(pullRequest);
      break;
    }
    case GithubActionEventName.PR머지승인: {
      core.info('Pull Request 승인이 감지되었습니다. 메세지를 보냅니다.');
      const review = await getPullRequestReview();
      await sendReviewApprovedSlackMessage({ pullRequest, review });
      break;
    }
    case GithubActionEventName.PR리뷰코멘트: {
      const comment = await getPullRequestComment();

      if (hasMentionInMessage(comment.message)) {
        core.info('Pull Request에 멘션이 포함된 새로운 댓글이 감지되었습니다. 메세지를 보냅니다.');
        await sendPullRequestCommentSlackMessage({ pullRequest, comment });
      }

      break;
    }
  }

  core.info('👋 Done');
}

try {
  main();
} catch (e: any) {
  core.setFailed(e);
}
