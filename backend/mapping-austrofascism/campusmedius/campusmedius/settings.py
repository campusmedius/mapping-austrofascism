"""
Django settings for campusmedius project.

Generated by 'django-admin startproject' using Django 1.11.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.11/ref/settings/
"""

import os

SITE_ID = 1

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    'SECRET_KEY', '1ej7y%iw9yg3o^8f7c*(*ruvf15gt2z@b=*x7#eaple2%ru(*p')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(os.environ.get('DEBUG', False))

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split()
CORS_ORIGIN_ALLOW_ALL = bool(os.environ.get('CORS_ORIGIN_ALLOW_ALL', True))

# Application definition

INSTALLED_APPS = [
    'rest_framework',
    'taggit',
    'taggit_autosuggest',
    'taggit_serializer',
    'main',
    'topography',
    'topology',
    'information',
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',
    'django_extensions',
    'location_field.apps.DefaultConfig',
    'tinymce',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES':
    ('djangorestframework_camel_case.render.CamelCaseJSONRenderer',
     'rest_framework.renderers.JSONRenderer',
     'rest_framework.renderers.BrowsableAPIRenderer'),
    'DEFAULT_PARSER_CLASSES':
    ('djangorestframework_camel_case.parser.CamelCaseJSONParser', ),
    'DEFAULT_AUTHENTICATION_CLASSES':
    ('rest_framework.authentication.SessionAuthentication', ),
    'DEFAULT_PERMISSION_CLASSES':
    ('rest_framework.permissions.IsAuthenticatedOrReadOnly', )
}

ROOT_URLCONF = 'campusmedius.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'campusmedius/templates'),],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'campusmedius.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE':
        'django.db.backends.sqlite3',
        'NAME':
        os.environ.get('DB_PATH',
                       os.path.join(BASE_DIR, '../db/campusmedius.sqlite3'))
    }
}

# Password validation
# https://docs.djangoproject.com/en/1.11/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME':
        'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME':
        'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Europe/Vienna'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# location_field
LOCATION_FIELD = {'map.provider': 'openstreetmap', 'map.zoom': 10}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = '../static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, './campusmedius/static')
]

MEDIA_ROOT = os.environ.get('MEDIA_ROOT', os.path.join(BASE_DIR, '../media'))
MEDIA_URL = '/media/'

TINYMCE_DEFAULT_CONFIG = {
    'selector': 'textarea',
    'theme': 'modern',
    'plugins': 'link image preview codesample contextmenu table code lists codemirror',
    'toolbar1': 'italic underline | bullist numlist | code',
    'contextmenu': 'formats',
    'menubar': False,
    'inline': False,
    'statusbar': True,
    'height': 360,
    'inline_styles': False,
    'formats': {
        'italic': {
            'inline': 'i'
        }
    },
    'valid_elements': '*[*]',
    'entity_encoding': 'raw',
    'content_css': STATIC_URL + 'admin/css/custom-tinymce.css',
    'codemirror': {
        'indentOnInit': True,
        'fullscreen': True,
        'saveCursorPosition': True,
        'width': 1200,
        'path': 'CodeMirror-5.19.0/'
    },
    'convert_urls': False
}

TAGGIT_AUTOSUGGEST_MODELS = ('main', 'CampusmediusTag')