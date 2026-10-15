from decimal import Decimal

from django.db import migrations


def crear_adicionales(apps, schema_editor):
    Adicional = apps.get_model("reservas", "Adicional")
    db = schema_editor.connection.alias

    adicionales = [
        ("Menú diario", "10000.00"),
        ("Cochera", "5000.00"),
        ("Cuidado de niños", "15000.00"),
        ("Paseo histórico", "8000.00"),
        ("Traslado", "12000.00"),
        ("Servicios de spa", "20000.00"),
        ("Lavandería", "6000.00"),
        ("Acceso al gimnasio", "4000.00"),
    ]

    for nombre, precio in adicionales:
        Adicional.objects.using(db).get_or_create(
            nombre=nombre, defaults={"precio": Decimal(precio)}
        )


class Migration(migrations.Migration):
    dependencies = [
        ("reservas", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(crear_adicionales, migrations.RunPython.noop),
    ]
