from django.db import models


class City(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=200)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "country"], name="city_country_combination"
            )
        ]
