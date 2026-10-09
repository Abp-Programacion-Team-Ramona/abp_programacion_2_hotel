from decimal import Decimal

from django.db import migrations


def crear_habitaciones(apps, schema_editor):
    Habitacion = apps.get_model("habitaciones", "Habitacion")
    db = schema_editor.connection.alias

    habitaciones = [
        {
            "numero": 101,
            "tipo": "Simple",
            "capacidad": 2,
            "precio": Decimal("60000.00"),
        },
        {
            "numero": 201,
            "tipo": "Suite",
            "capacidad": 4,
            "precio": Decimal("110000.00"),
        },
        {
            "numero": 202,
            "tipo": "Suite",
            "capacidad": 6,
            "precio": Decimal("150000.00"),
        },
    ]

    for habitacion in habitaciones:
        numero = habitacion["numero"]

        Habitacion.objects.using(db).get_or_create(
            numero=numero,
            defaults={
                "tipo": habitacion["tipo"],
                "capacidad": habitacion["capacidad"],
                "precio": habitacion["precio"],
            },
        )


class Migration(migrations.Migration):
    dependencies = [
        ("habitaciones", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(crear_habitaciones, migrations.RunPython.noop),
    ]
