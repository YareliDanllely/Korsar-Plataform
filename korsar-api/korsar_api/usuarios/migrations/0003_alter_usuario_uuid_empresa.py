# Generated by Django 4.2.16 on 2024-10-18 18:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('empresas', '0003_remove_empresa_uuid_parque_eolico'),
        ('usuarios', '0002_remove_usuario_nombre_empresa_usuario_uuid_empresa'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usuario',
            name='uuid_empresa',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='empresas.empresa'),
        ),
    ]