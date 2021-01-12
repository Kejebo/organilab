# Generated by Django 2.2.13 on 2020-10-06 18:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('laboratory', '0017_auto_20201005_1241'),
        ('reservations_management', '0008_auto_20201006_1136'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservations',
            name='laboratory',
            field=models.ForeignKey(default=38, on_delete=django.db.models.deletion.CASCADE, to='laboratory.Laboratory'),
            preserve_default=False,
        ),
    ]