# Web-Knowledge-Playground
- 首页不同模块的入口，ex: js / html、css / react、vue / ...
- 不同模块内部都有搜索功能，可搜索知识点，暂定标题为搜索内容命中点
- 模块内部有知识点标题大纲

ToDo
1. Summary of Mdx文件导入用contentlayer/mdx-bundler替换
2. Summary of 主题切换
3. sass/scss和less区别，及其引入
4. mdx中的date pre-commit hook 更新
5. mdx实现： 
  - The official way, with @next/mdx
  - Hashicorp's next-mdx-enhanced
  - Hashicorp's next-mdx-remote
  - Kent C Dodds' mdx-bundler
  - contentLayer
6. Combine @next/mdx with contentLayer
7. sandpack 高度过高自动折叠并添加show more按钮（同时研究文件内代码折叠）


注意：
- MDX文件名不能全部为中文，contentlayer生成json文件时识别不了中文，同一文件夹下两个全中文名的文件生成的json文件名会重复导致报错
- MDX文章内的标题尽量避免出现中文符号，`rehype-autolink-headings`插件在为标题添加锚点时，可能会替换或删除中文符号。


## Utils

### 1. Todo List
好像Apple的 提醒事项 + 日历同步 可实现所有功能，相互之间虽然能同步，但跳转有问题
- 入口页：
  - 功能：
    - 方便的切换 年/**月**
    - 进入详情日期
    - 进入某一tag的详情页：同一任务的子任务分散在不同的日期，以tag标识为同一任务。在本页面可以查看这一任务的所有事项详情。
    - 总体完成和未完成统计
  - 页面UI：一整个月的日历
    - 整体为当前月的日历
    - 日期某一天展示：todo数量、done数量、是否有未完成(背景色)
    - 
- 日期详情页
  - 功能
    - 添加Todo
    - 完成Todo
    - 修改Todo
    - 搜索Todo
    - Todo可添加tag
    - Todo可添加截止日期
    - 筛选Todo/Done List by tag
    - 多选，可进行完成、添加tag/deadline等操作
  - 页面UI：左右两个list并排
    - Todo List
    - Done List
    - Todo Item：标题、截止日期、Tags
