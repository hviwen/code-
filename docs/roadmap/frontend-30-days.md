# 30 天前端面试复习路线

每天只做三件事：口述答案、写一小段代码、记录错题。

## 第 1 周：JavaScript 基础和手写题

### Day 1：数据类型和判断

- [ ] 复习：[原始数据类型](../interview/javascript/core/001-javascript.md)
- [ ] 复习：[`typeof null`](../interview/javascript/core/002-typeof-null.md)
- [ ] 复习：[判断数组](../interview/javascript/core/003-question.md)
- [ ] 练习：在 `practice/javascript/` 手写一个类型判断函数。
- [ ] 复盘：错题记录到 [错题记录](../notes/wrong-answers.md)。

### Day 2：类型转换和相等判断

- [ ] 复习：[`==` 和 `===`](../interview/javascript/core/004-question.md)
- [ ] 复习：[`undefined` 和 `null`](../interview/javascript/core/005-javascript-undefined-null.md)
- [ ] 复习：[隐式转换和显式转换](../interview/javascript/core/006-question.md)
- [ ] 练习：整理 5 个容易答错的类型转换例子。
- [ ] 复盘：错题记录到 [错题记录](../notes/wrong-answers.md)。

### Day 3：函数、作用域和闭包

- [ ] 复习：[函数声明和函数表达式](../interview/javascript/core/016-question.md)
- [ ] 复习：[函数提升](../interview/javascript/core/017-hoisting.md)
- [ ] 复习：[作用域链](../interview/javascript/core/018-javascript.md)
- [ ] 复习：[闭包](../interview/javascript/core/019-question.md)
- [ ] 练习：写一个闭包计数器和一个闭包缓存函数。

### Day 4：this、call、apply、bind

- [ ] 复习：[`this` 指向](../interview/javascript/core/022-this.md)
- [ ] 复习：[`call`、`apply`、`bind`](../interview/javascript/core/023-call-apply-bind.md)
- [ ] 练习：手写 `call`、`apply`、`bind`，放到 `practice/javascript/`。

### Day 5：对象、原型和 new

- [ ] 复习：[创建对象](../interview/javascript/core/031-question.md)
- [ ] 复习：[原型链](../interview/javascript/core/032-question.md)
- [ ] 复习：[`__proto__` 和 `prototype`](../interview/javascript/core/033-proto-prototype.md)
- [ ] 复习：[`new` 执行过程](../interview/javascript/core/044-new.md)
- [ ] 练习：手写 `new`。

### Day 6：拷贝、继承和对象 API

- [ ] 复习：[深拷贝](../interview/javascript/core/036-question.md)
- [ ] 复习：[JavaScript 继承机制](../interview/javascript/core/042-javascript.md)
- [ ] 练习：手写一个覆盖常见类型的 `deepClone`。

### Day 7：周复盘

- [ ] 回看本周所有 `[~]` 项。
- [ ] 更新 [错题记录](../notes/wrong-answers.md)。
- [ ] 更新 [周复盘](../notes/weekly-review.md)。

## 第 2 周：ES6 和异步

### Day 8：let、const、var

- [ ] 复习：[`let`、`const` 和 `var`](../interview/javascript/es6/046-let-const-var.md)
- [ ] 复习：[块级作用域](../interview/javascript/es6/047-question.md)
- [ ] 复习：[暂时性死区](../interview/javascript/es6/048-tdz.md)

### Day 9：箭头函数和参数

- [ ] 复习：[箭头函数语法](../interview/javascript/es6/054-question.md)
- [ ] 复习：[箭头函数和普通函数区别](../interview/javascript/es6/055-question.md)
- [ ] 复习：[箭头函数中的 this](../interview/javascript/es6/056-this.md)

### Day 10：解构、模板字符串、扩展运算符

- [ ] 复习：[解构赋值](../interview/javascript/es6/062-question.md)
- [ ] 复习：[模板字符串](../interview/javascript/es6/072-question.md)
- [ ] 复习：[扩展运算符合并数组](../interview/javascript/es6/080-question.md)

### Day 11：Class、Symbol、Map、Set

- [ ] 复习：[ES6 class](../interview/javascript/es6/086-es6.md)
- [ ] 复习：[Symbol](../interview/javascript/es6/098-symbol.md)
- [ ] 复习：[Set](../interview/javascript/es6/104-set.md)
- [ ] 复习：[Map 和 Object](../interview/javascript/es6/106-map-object.md)

### Day 12：Promise

- [ ] 复习：[Promise](../interview/javascript/async-modern/116-promise.md)
- [ ] 复习：[Promise 状态](../interview/javascript/async-modern/117-promise.md)
- [ ] 复习：[Promise 链式调用](../interview/javascript/async-modern/120-promise.md)
- [ ] 练习：手写简化版 Promise。

### Day 13：async/await 和事件循环

- [ ] 复习：[async/await](../interview/javascript/async-modern/128-async-await.md)
- [ ] 复习：[事件循环](../interview/javascript/async-modern/136-javascript.md)
- [ ] 复习：[宏任务和微任务](../interview/javascript/async-modern/137-question.md)

### Day 14：周复盘

- [ ] 回看本周所有 `[~]` 项。
- [ ] 更新 [错题记录](../notes/wrong-answers.md)。
- [ ] 更新 [周复盘](../notes/weekly-review.md)。

## 第 3 周：Vue 3、Pinia、Vue Router

### Day 15：响应式基础

- [ ] 复习：[`ref` 和 `reactive`](../interview/vue/vue3-core/q001-ref-reactive.md)
- [ ] 复习：[`computed` 和 `watch`](../interview/vue/vue3-core/q002-computed-watch.md)
- [ ] 复习：[`watchEffect` 和 `watch`](../interview/vue/vue3-core/q015-watcheffect-watch.md)

### Day 16：组件基础

- [ ] 复习：[`setup`](../interview/vue/vue3-core/q003-setup-this.md)
- [ ] 复习：[`script setup` props/emits](../interview/vue/vue3-core/q004-script-setup-props-emits.md)
- [ ] 复习：[props 和 emit](../interview/vue/vue3-core/q007-props-emit.md)

### Day 17：模板和渲染

- [ ] 复习：[`v-if` 和 `v-show`](../interview/vue/vue3-core/q005-v-if-v-show.md)
- [ ] 复习：[`v-for` 的 key](../interview/vue/vue3-core/q006-v-for-key-key.md)
- [ ] 复习：[`nextTick`](../interview/vue/vue3-core/q010-nexttick.md)

### Day 18：高级 Composition API

- [ ] 复习：[`useFetch` composable](../interview/vue/vue3-advanced/q001-usefetch-composable.md)
- [ ] 复习：[防抖/节流 composable](../interview/vue/vue3-advanced/q003-composable.md)
- [ ] 练习：运行或补充 `src/composables/` 相关测试。

### Day 19：Pinia

- [ ] 复习：[Pinia 和 Vuex](../interview/pinia/core/q001-pinia-vuex.md)
- [ ] 复习：[store、state、getters、actions](../interview/pinia/core/q002-store-state-getters-actions.md)
- [ ] 复习：[`storeToRefs`](../interview/pinia/core/q016-storetorefs.md)

### Day 20：Vue Router

- [ ] 复习：[Vue Router](../interview/vue-router/core/q001-vue-router.md)
- [ ] 复习：[`router-link` 和 `router.push`](../interview/vue-router/core/q002-router-link-router-push.md)
- [ ] 复习：[导航守卫](../interview/vue-router/core/q007-beforeeach.md)

### Day 21：周复盘

- [ ] 回看本周所有 `[~]` 项。
- [ ] 更新 [错题记录](../notes/wrong-answers.md)。
- [ ] 更新 [周复盘](../notes/weekly-review.md)。

## 第 4 周：综合练习和模拟面试

### Day 22：手写题集中练习

- [ ] 跟随 [手写题路线](handwrite-practice.md) 复习防抖、节流、深拷贝。
- [ ] 每题限制 15 分钟手写。

### Day 23：异步手写题

- [ ] 手写 Promise。
- [ ] 手写并发控制器。
- [ ] 复盘事件循环题。

### Day 24：算法和数据结构

- [ ] 复习 [排序面试指南](../practice/algorithm/sorting/interview-guide.md)。
- [ ] 练习 `practice/challenge/sort.js`。
- [ ] 对照 `src/data-structures/` 复习链表、堆、树、图。

### Day 25：Vue 场景题

- [ ] 复习 Vue 响应式、组件通信、性能优化。
- [ ] 口述 3 个项目场景题。

### Day 26：工程化和模块

- [ ] 复习：[ES6 模块和 CommonJS](../interview/javascript/async-modern/141-es6-commonjs.md)
- [ ] 复习：[Tree-shaking](../interview/javascript/async-modern/145-tree-shaking.md)

### Day 27：综合模拟一

- [ ] JavaScript 10 题口述。
- [ ] Vue 10 题口述。
- [ ] 手写题 2 道。

### Day 28：综合模拟二

- [ ] 重做所有错题。
- [ ] 更新 [错题记录](../notes/wrong-answers.md)。

### Day 29：查漏补缺

- [ ] 只处理 `[~]` 和错题。
- [ ] 不新增学习范围。

### Day 30：最终复盘

- [ ] 整理最终高频问题清单。
- [ ] 更新 [周复盘](../notes/weekly-review.md)。
- [ ] 确认 `pnpm test` 可运行。
