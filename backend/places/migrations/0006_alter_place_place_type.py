# Generated by Django 4.0.5 on 2022-06-12 22:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0005_place_pic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='place',
            name='place_type',
            field=models.CharField(choices=[('Library', 'Library'), ('Conservation Park', 'Conservation Park'), ('Gallery', 'Gallery'), ('Playground', 'Playground')], max_length=30),
        ),
    ]