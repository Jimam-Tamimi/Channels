# Generated by Django 5.1.1 on 2024-09-16 19:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('channels_app', '0007_alter_message_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
