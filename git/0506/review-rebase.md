1. git pull --rebase（强烈推荐习惯）

```shell
git pull --rebase
```

✅ 场景
每天拉代码同步远程

避免产生无意义 merge commit

👍 优点
保持历史线性
log 更干净

⚠️ 注意
如果本地有修改，可能需要处理冲突

👉 面试延伸：
为什么比 git pull 更推荐？

因为 git pull 默认会执行 merge 操作，可能会产生无意义的 merge commit，导致历史记录混乱。而 git pull --rebase 会将本地的提交放在远程提交之后，保持历史线性，使得 log 更干净，更容易理解和维护。

### 本地举例

假设远程仓库有提交 A 和 B，本地有提交 C：

```远程: A --- B
本地: C
```

使用 git pull --rebase 后：

```远程: A --- B
本地: A --- B --- C
```
