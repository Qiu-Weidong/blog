---
title: django项目搭建
date: 2023-03-01 13:09:03
tags:
  - django
categories:
  - django
---
## 安装 Django
```bash
pip install Django
```

## 新建项目
```bash
django-admin startproject 项目名称
```
创建完成后的项目结构
```
.
├── 项目名称
│   ├── asgi.py
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── __init__.cpython-310.pyc
│   │   ├── settings.cpython-310.pyc
│   │   ├── urls.cpython-310.pyc
│   │   └── wsgi.cpython-310.pyc
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── db.sqlite3
└── manage.py

2 directories, 11 files
```
## 运行项目
```bash
python3 manage.py runserver 0.0.0.0:8000
```
可能需要在 `settings.py` 里面设置一下 `ALLOWED_HOSTS` 选项。


## 创建 app
```bash
django-admin startapp app名称
```
然后在 `settings.py` 里面将新建的 app 添加到 `INSTALLED_APPS` 配置项。
```python
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    '新建的 app 名称',               # 添加此项
)
```

## 定义模型
在新创建的 app 下面的 `models.py` 文件里面创建模型，需要集成自 `models.Model`，如下所示
```python
from django.db import models

# Create your models here.
class User(models.Model):
  user_name = models.CharField(verbose_name='用户名', max_length=32)
  password = models.CharField(verbose_name='密码', max_length=64)
```

然后使用
```bash
python3 manage.py migrate
```
命令来创建表结构。
该命令的输出如下所示：
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying admin.0003_logentry_add_action_flag_choices... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying auth.0009_alter_user_last_name_max_length... OK
  Applying auth.0010_alter_group_name_max_length... OK
  Applying auth.0011_update_proxy_permissions... OK
  Applying auth.0012_alter_user_first_name_max_length... OK
  Applying sessions.0001_initial... OK
```

然后使用
```bash
python3 manage.py makemigrations app名称
```
命令在数据库中创建表结构。
输出如下所示
```bash
Migrations for 'data_analysis_platform_api':
  data_analysis_platform_api/migrations/0001_initial.py
    - Create model User
```

最后使用
```bash
python3 manage.py migrate app名称
```
命令来完成数据库的迁移。
输出如下
```
Operations to perform:
  Apply all migrations: data_analysis_platform_api
Running migrations:
  Applying data_analysis_platform_api.0001_initial... OK
```

在新建的 app 中新增一个 `urls.py` 文件，并且在 `project` 的 `urls.py` 文件中将其包含进去
```python
# urls.py

from django.contrib import admin
from django.urls import path, include


urlpatterns = [
  path('admin/', admin.site.urls),
  path('platform/', include('data_analysis_platform_api.urls'))
]

```
在新增的 app 中编写视图文件
```python
# views.py

from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
@csrf_exempt
def hello(request):
  return HttpResponse("Hello world ! ")
```
## 创建超级用户
```bash
python3  manage.py createsuperuser
```

## 安装 django rest framework
```bash
pip install djangorestframework
```
将 `rest_framework` 添加到 `INSTALLED_APPS`。
```python
INSTALLED_APPS = (
  ...
  'rest_framework',               # 添加此项
)
```
安装 `djangorestframework-jwt`
```bash
pip install djangorestframework-jwt
```













