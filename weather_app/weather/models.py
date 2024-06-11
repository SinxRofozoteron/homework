from django.db import models


class City(models.Model):
    name = models.CharField(max_length=200, blank=False)
    country = models.CharField(max_length=200, blank=False)
    lat = models.CharField(max_length=15, blank=False)
    lng = models.CharField(max_length=15, blank=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "country"], name="unique_city_name_country_constraint"
            )
        ]
