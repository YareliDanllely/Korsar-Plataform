# Generated by Django 4.2.16 on 2024-12-01 20:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('imagenes', '0002_alter_imagen_estado_clasificacion'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='imagen',
            options={'verbose_name': 'Imagen', 'verbose_name_plural': 'Imagenes'},
        ),
    ]