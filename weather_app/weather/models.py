from django.db import models


class City(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    lat = models.CharField(max_length=15)
    lng = models.CharField(max_length=15)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "country"], name="unique_city_name_country_constraint"
            )
        ]
