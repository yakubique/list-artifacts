# List artifacts

List a build artifacts that can be used by subsequent workflow steps

[![Test `list-artifacts` action](https://github.com/yakubique/list-artifacts/actions/workflows/test-myself.yaml/badge.svg)](https://github.com/yakubique/list-artifacts/actions/workflows/test-myself.yaml)

[Usage workflow](https://github.com/yakubique/list-artifacts/actions/workflows/test-myself.yaml)

## Usage
```yaml
- name: List artifacts
  id: list
  uses: yakubique/list-artifacts@v1
  with:
    name: test-*

# Output example: $> echo "${{ steps.list.outputs.result }}"
#  [
#    {
#      "name": "test-2",
#      "id": 1278446917,
#      "size": 140,
#      "createdAt": "2024-02-27T11:15:32.000Z"
#    },
#    {
#      "name": "test-1",
#      "id": 1278446907,
#      "size": 137,
#      "createdAt": "2024-02-27T11:15:31.000Z"
#    }
#  ]
```
