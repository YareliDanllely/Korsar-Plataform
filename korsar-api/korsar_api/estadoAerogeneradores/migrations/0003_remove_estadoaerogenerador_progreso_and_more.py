# Generated by Django 4.2.16 on 2024-11-02 20:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('estadoAerogeneradores', '0002_estadoaerogenerador_uuid_aerogenerador'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='estadoaerogenerador',
            name='progreso',
        ),
        migrations.AlterField(
            model_name='estadoaerogenerador',
            name='estado_final_clasificacion',
            field=models.IntegerField(blank=True, choices=[(1, 'Sin daño'), (2, 'Menor'), (3, 'Significativo'), (4, 'Mayor'), (5, 'Crítico')], null=True),
        ),
    ]