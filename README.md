这是一个主打一个缝合的项目，用来写日记和todolist    

页面组成:
1. diary 写日记的地方，没什么特别的 react-md-editor + react-calendar 融合
2. todoList 记录待做的事项，没什么特别的 react-dnd  (打算分成俩个todolist 一个以天为基本单位(已完成)，一个以分钟为单位去专门搞该天的然后好把该天的时间线保存?(待定))
3. planner? 待定
4. message : 比较魔怔 打算一个简易通讯的 毕竟我有朋友 他魔怔到用邮件通讯的....
5. archive 按天将该天所有的数据全部整合 并按月将整一个月的归档
6. index 用d3 画点统计图？ 之类的 还有一些内容显示和控制 
    
    
### 使用
```
pnpm install

pnpm dev 
```


