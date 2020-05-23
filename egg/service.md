# service 服务

service 就是把复杂的业务场景下的逻辑抽象封装，

1. 保持 controller 中的逻辑清晰
2. 保持业务的独立性，一些函数可被多个 controller 复用
3. 将逻辑 和 展现分离，更容易写测试用例

案例：

```js
// app/service/user.js
const Service = require('egg').Service;

class UserService extends Service {
  async find(uid) {
    const user = await this.ctx.db.query(
      'select * from user where uid = ?',
      uid
    );
    return user;
  }
}

module.exports = UserService;
```

在当前类中，`this` 的属性有：

1. ctx 当前上下文实例
2. app 当前 application 实例，可以拿到框架提供的 全局对象 和 方法
3. service 应用定义的 service，可以访问其他业务层， 等价 `this.ctx.service`
4. config 应用运行时的 配置项
5. logger logger 对象
