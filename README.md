# Lubycon Github Reviewer Notify Action

## Usage

다음과 같은 깃헙 액션을 `.github/workflows` 디렉토리에 생성해주세요.
액션 이름을 입력할 때는 현재 버전을 잘 보고 `Lubycon/github-reviewer-noti-action@{최신버전}`의 포맷으로 입력해주세요.

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
        uses: Lubycon/github-reviewer-noti-action@v2.0.0
        with:
          github-token: ${{ secrets.LUBYCON_GITHUB_TOKEN }}
          mattermost-webhook: ${{ secrets.MATTERMOST_WEBHOOK_URL }}
```

## Configuration

| 이름                 | 설명                                                                |
| -------------------- | ------------------------------------------------------------------- |
| `github-token`       | Github Personal Access Token. `repo` 스코프를 지정해서 생성해주세요 |
| `mattermost-webhook` | 매터모스트 웹훅 URL (존재하면 매터모스트에도 노티를 보냅니다)       |
