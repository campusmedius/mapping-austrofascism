# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-27 20:33
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('topography', '0006_auto_20171027_2032'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='next_event',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='previous_event', to='topography.Event'),
        ),
    ]