# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-01-03 19:43
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('information', '0022_auto_20181225_2104'),
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='page',
            name='information',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='information.Information'),
        ),
    ]
