# Generated by Django 4.2.16 on 2024-11-07 18:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('anomalias', '0003_remove_anomalia_coordenada_x_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='anomalia',
            name='observacion_anomalia',
        ),
        migrations.AddField(
            model_name='anomalia',
            name='ubicacion_componente',
            field=models.CharField(choices=[('aspa_interna', 'Aspa Interna'), ('aspa_externa', 'Aspa Externa'), ('nacelle', 'Nacelle/Hub'), ('torre', 'Torre')], default='', max_length=15),
            preserve_default=False,
        ),
    ]