# meetsync

给一小群朋友用的、不需要登录的聚会撮合工具:发起人建一个活动,分享一个链接,参与者进来报自己哪些时间不行、感兴趣哪些主题(吃饭/喝咖啡/打游戏/线上会议),再声明自己是不是想请客。系统把这些原始数据摊开给大家看(第一版是汇总统计,自动加权撮合方案是后续版本——见 [ADR-0013](docs/adr/0013-release-1-raw-tally-no-matching-engine.md))。

**差异点:主题为中心,不是日历为中心。** 时间敏感度、优先级、是否请客都是挂在"主题"下面的属性,不是先定一个全局日历再往上贴活动。允许一次撮合产出多个方案(比如一部分人去吃饭,另一部分人线上打游戏),不强求所有人挤进同一个结果。

## 状态

开始实现 Release 1(工单 [#2](https://github.com/wiloon/meetsync/issues/2)–[#10](https://github.com/wiloon/meetsync/issues/10))。

- 术语表:[`CONTEXT.md`](CONTEXT.md)
- 架构决策:[`docs/adr/`](docs/adr/)(0001–0013)
- Phase 1 需求:[issue #1](https://github.com/wiloon/meetsync/issues/1)(真源;仓库里 [`docs/spec-phase1.md`](docs/spec-phase1.md) 只是指针)

工程流程按 [mattpocock-skills](https://github.com/mattpocock/skills)。

## 本地运行

- 后端(Go,`:8080`):`task api:dev`,测试 `task api:test`
- 前端(Next.js,`:3000`):`task web:dev` —— 需要 Node 18.18+/20+(仓库默认的 fnm/nvm 版本太旧),见 `web/.node-version`
- 前端通过 `NEXT_PUBLIC_API_URL`(默认 `http://localhost:8080`)访问后端

## License

[AGPL-3.0](LICENSE)
