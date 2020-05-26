# study

## egg-sequelize

sequelize 命令：

    sequelize init                  初始化项目
    sequelize init：config          初始化配置
    sequelize init：migrations      初始化迁移
    sequelize init：models          初始化模型
    sequelize init：seeders         初始化种子

    sequelize db：create            创建配置指定的数据库
    sequelize db：drop              删除配置指定的数据库

    sequelize migration：generate   生成一个新的迁移文件[别名：migration：create]
    sequelize model：generate       生成模型及其迁移[别名：model：create]
    sequelize seed：generate        生成一个新的种子文件[别名：seed：create]

    sequelize db：migrate           运行挂起的迁移
    sequelize db：migrate：schema：timestamps：add    更新迁移表以具有时间戳
    sequelize db：migrate：status   列出所有迁移的状态
    sequelize db：migrate：undo     恢复迁移
    sequelize db：migrate：undo：   all还原所有已运行的迁移

    sequelize db：seed              运行指定的种子
    sequelize db：seed：undo        从数据库中删除数据
    sequelize db：seed：all         运行每个种子
    sequelize db：seed：undo：all   从数据库中删除数据

```shell
# sequelize init
#  相当于执行了 init: config/migrations/models/seeds 这几条命令
npx sequelize init

# init:config/migrations/models/seeds   会创建相应的文件

# 创建 model 文件 和 migration文件
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string

# 创建一个迁移文件
npx sequelize-cli migration:generate --name migration-skeleton

# 执行迁移文件  --  默认执行 migration 中所有 没有运行过 文件的 up 函数
npx sequelize-cli db:migrate

# 将还原到上次迁移的位置
npx sequelize-cli db:migrate:undo

```

详情参考：[CLI(Command line interface-命令行界面)](https://itbilu.com/nodejs/npm/sequelize-docs-v5.html#migrations)

[sequlize-cli 命令行总结](https://github.com/sequelize/cli)

## Sequelize 数据类型

[数据类型](https://itbilu.com/nodejs/npm/sequelize-docs-v5.html#data-types)

**常用类型：**

```js
// 文本、文字
Sequelize.STRING; // VARCHAR(255)
Sequelize.STRING(1234); // VARCHAR(1234)
Sequelize.TEXT; // TEXT

// 数字
Sequelize.INTEGER; // INTEGER
Sequelize.BIGINT; // BIGINT

// 浮点数
Sequelize.FLOAT; // FLOAT

// 时间
Sequelize.DATE; // DATETIME用于mysql / sqlite
Sequelize.DATE(6); // 用于mysql 5.6.4+。小数秒支持高达6位精度
Sequelize.DATEONLY; // 日期-没有时间
Sequelize.NOW;

// 布尔值
Sequelize.BOOLEAN;
```

## 模型定义

### 单个字段定义

详情参考：[intt](https://sequelize.org/master/class/lib/model.js~Model.html#static-method-init)

```js
var model = {
  attr: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: 'tan',
    // 唯一主键
    unique: true
    // 类型为 INTEGER 的时候，自动递增
    // autoIncrement: true
    // 自定义属性名
    field: 'field_with_underscores',
    // 添加注释
    comment: 'This is a column name that has a comment',
    // 验证
    validateL: {
      is: [ "[a-z]", "i" ],
      max: 23
    },
    // 创建外键
    references: {
     // 这是对另一个模型模型的引用: Bar,
     // 这是引用的模型键的列名: 'id',
     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
   }
  },
};
```

### 定义一个表

**[参考](https://itbilu.com/nodejs/npm/sequelize-docs-v5.html#models-definition)**

```js
// 1. define
const User = this.sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: 'user_id',
    },
    userSecondId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      field: 'user_second_id',
    },
  },
  {
    tableName: 'tbl_user',
    indexes: [
      {
        unique: true,
        fields: ['user_second_id'],
      },
    ],
  }
);

// 2. init
const Model = Sequelize.Model;
class User extends Model {}
User.init(
  {
    // attributes
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      // allowNull defaults to true
    },
  },
  {
    sequelize,
    modelName: 'user',
    // options
  }
);
```

在 define 中，第二个参数的配置：

```js
class Bar extends Model {}
Bar.init({ /* bla */ }, {
  // 模型名。本模型将以该名称存储在`sequelize.models`中。
  // 默认为类的名称，即在这种情况下为`Bar`。 这将控制自动生成的`foreignKey`的名称和关联命名
  modelName: 'bar',

  // 不要添加时间戳属性 (updatedAt, createdAt)
  timestamps: false,

  // 不实际删除数据库记录，而是设置一个新 deletedAt 属性，其值为当前日期
  // `paranoid` 仅在 `timestamps` 启用时可用
  paranoid: true,

  // 自动设置字段为蛇型命名规则
  // 不会覆盖已定义的字段选项属性
  underscored: true,

  // 禁止修改表名
  // 默认情况下，sequelize 会自动将所有传递的模型名称转换为复数形式。 如果不想这样做，请设置以下内容
  freezeTableName: true,

  // 定义表名
  tableName: 'my_very_custom_table_name',

  // 启用乐观锁定。启用后，sequelize将向模型添加版本计数属性，并在保存旧实例时引发 `OptimisticLockingError` 错误。
  // 设置为`true`或使用要启用的属性名称的字符串。
  version: true,

  // Sequelize 实例
  sequelize,

  // 设置 get 的方法
  getterMethods: {
    fullname( val ){
      return this.firstname + " " + this.lastname
    }
  }
})
```


## migrations 中 queryInterface 迁移文件的编写

```js
// 创建数据库
async createDatabase(database: string, options: object)
// 删除数据库
async dropDatabase(database: string, options: object)


// 创建 SQL 函数
async createFunction(functionName: string, params: Array, returnType: string )
// 删除方法
async dropFunction(functionName: string, params: Array, options: object)
// 创建 schema
async createSchema(schema: string, options: object)


// 创建 表
async createTable(tableName: string, attributes: object, options: object, model: Model)
// 删除表
async dropTable(tableName: string, options: object)
// 删除所有表
async dropAllTables(options: object)
// 重命名表
async renameTable(before: string, after: string, options: object)
// 描述 表  ---  返回表结构
async describeTable(tableName: string, options: object)


// 添加字段
async addColumn(table: string, key: string, attribute: object, options: object)
// 更改字段的定义
async changeColumn(tableName: string, attributeName: string, dataTypeOrOptions: object, options: object)
// 移除字段
async removeColumn(tableName: string, attributeName: string, options: object)
// 重命名列名
async renameColumn(tableName: string, attrNameBefore: string, attrNameAfter: string, options: object)


// 添加约束  -- 外键-主键
async addConstraint(tableName: string, options: object)
// 移除约束
async removeConstraint(tableName: string, constraintName: string, options: object)
// 添加索引
async addIndex(tableName: string | object, attributes: Array, options: object, rawTablename: string)
// 移除索引
async removeIndex(tableName: string, indexNameOrAttributes: string | string[], options: object)


// 批量删除
async bulkDelete(tableName: string, where: object, options: object, model: Model)
// 批量增加
async bulkInsert(tableName: string, records: Array, options: object, attributes: object)
// 批量更新
async bulkUpdate(tableName: string, values: object, identifier: object, options: object, attributes: object)


// 增补
async upsert(tableName: string, insertValues: object, updateValues: object, where: object, model: Model, options: object)
```

**[参考官方 migration 文档](https://sequelize.org/master/class/lib/dialects/abstract/query-interface.js~QueryInterface.html)**

## 关于 model 文件

**参考[egg-sequelize](https://www.npmjs.com/package/egg-sequelize)**

**[案例](https://sequelize.org/master/manual/migrations.html#creating-the-first-model--and-migration-)**

建议编写 `migration` 文件后，手动编写 `model` 文件

表的关联参考：

```js
// app/model/post.js

module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Post = app.model.define('Post', {
    name: STRING(30),
    user_id: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  });

  Post.associate = function () {
    app.model.Post.belongsTo(app.model.User, { as: 'user' });
  };

  return Post;
};
```

[egg-sequelize 文章末尾的案例](https://www.npmjs.com/package/egg-sequelize)

## 多对多

[在EggJS中使用Sequelize做联表查询](https://www.jianshu.com/p/078087c69b77)

[egg sequelize 实践](https://juejin.im/post/5c2db28de51d453529627ef4)


