# Generated by Django 2.2.12 on 2020-06-16 14:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('laboratory', '0007_auto_20200615_2119'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='laboratory',
            name='laboratorists',
        ),
        migrations.RemoveField(
            model_name='laboratory',
            name='students',
        ),
    ]
