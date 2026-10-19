from django.db import migrations


def crear_roles(apps, schema_editor):
    Rol = apps.get_model("usuarios", "Rol")

    roles = [
        "Administrador",
        "Empleado",
        "Cliente",
    ]

    for descripcion in roles:
        Rol.objects.using(schema_editor.connection.alias).get_or_create(
            descripcion=descripcion
        )


class Migration(migrations.Migration):
    dependencies = [
        ("usuarios", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(crear_roles, migrations.RunPython.noop),
    ]
