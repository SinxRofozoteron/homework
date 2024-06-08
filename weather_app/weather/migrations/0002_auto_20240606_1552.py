# Generated by Django 5.0.6 on 2024-06-06 21:52
import csv
import os

from django.db import migrations, transaction
from django.db.utils import IntegrityError
from weather.models import City


def populate_city_table(*args):
    db_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "../../data/worldcities.csv"
    )
    with open(db_path, mode="r", encoding="utf-8") as csv_file:
        reader = csv.reader(csv_file)

        skip_line = True
        for row in reader:
            if skip_line:
                skip_line = False
                continue

            try:
                with transaction.atomic():
                    city = City(
                        name=row[1].capitalize(),
                        country=row[4].capitalize(),
                        lat=row[2],
                        lng=row[3],
                    )
                    city.save()
            except IntegrityError:
                continue


class Migration(migrations.Migration):

    dependencies = [
        ("weather", "0001_initial"),
    ]

    operations = [migrations.RunPython(populate_city_table)]
