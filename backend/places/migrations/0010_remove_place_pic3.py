# Generated by Django 4.0.5 on 2022-06-22 22:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0009_alter_place_area'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='place',
            name='pic3',
        ),
    ]
