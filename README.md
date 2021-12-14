# Lubycon Github Reviewer Notify Action

## Usage

1. 다음과 같은 깃헙 액션을 `.github/workflows` 디렉토리에 생성해주세요. 액션 이름을 입력할 때는 현재 버전을 잘 보고 `Lubycon/github-reviewer-noti-action@{최신버전}`의 포맷으로 입력해주세요.

2. **user-info-url** 값으로 json 파일의 위치를 등록해주세요.
   ```json
   [
     {
       "email": "foo@lubycon.com",
       "githubUserName": "gil-dong",
       "slackUserId": "SLACK_USER_ID"
     },
     {
       "email": "bar@lubycon.com",
       "githubUserName": "chun-hyang",
       "slackUserId": "SLACK_USER_ID"
     },
     ...,
     ...,
   ]
   ```

```yaml
name: Sample Action
on: [pull_request, pull_request_review]

jobs:
  create-pr:
    runs-on: ubuntu-latest
    name: Notification
    steps:
      - name: Checkout
        uses: actions/checkout@master
      - name: Fire Notification
        uses: Lubycon/github-reviewer-noti-action@v2.1.1
        with:
          slack-bot-token: ${{ secrets.SLACK_BOT_TOKEN }}
          slack-channel-id: ${{ secrets.SLACK_CHANNEL_ID }}
          user-info-url: my-json-url
```

## Configuration

| 이름               | 설명                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `slack-bot-token`  | 메세지를 보낼 슬랙봇 토큰. 루비콘 멤버라면 루비콘의 Org Secrets에 저장된 토큰을 사용할 수 있습니다 |
| `slack-channel-id` | 노티를 쏘고 싶은 슬랙 채널 ID                                                                      |
| `user-info-url`    | 리뷰어로 지정할 유저의 정보                                                                        |
