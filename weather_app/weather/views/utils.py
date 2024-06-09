import difflib

from weather.models import City


# check if city exists in the database
# and return suggestions if not
# If no suggestions return False
def check_city(user_input: str):
    normalized = user_input.replace(",", "")
    city, *country = normalized.split(" ")
    city, country = city.capitalize(), country[0].capitalize() if country else None

    try:
        if country and City.objects.get(name=city, country=country):
            return True

        foundCities = City.objects.filter(name=city).values_list("name", "country")
        if not foundCities:
            raise City.DoesNotExist

        if len(foundCities) == 1:
            return True

        return list(foundCities)
    except City.DoesNotExist:
        all_names = City.objects.values_list("name", flat=True).distinct()
        closest_city_matches = difflib.get_close_matches(
            city, all_names, n=5, cutoff=0.8
        )

        if country:
            all_countries = City.objects.values_list("country", flat=True).distinct()
            closest_country_matches = difflib.get_close_matches(
                country, all_countries, n=5, cutoff=0.8
            )
            closest_matches_with_countries = City.objects.filter(
                name__regex=f"^({"|".join(closest_city_matches)})$",
                country__regex=f"^({"|".join(closest_country_matches)})$",
            )
        else:
            closest_matches_with_countries = City.objects.filter(
                name__regex=f"^({"|".join(closest_city_matches)})$"
            )

        foundCities = closest_matches_with_countries.values_list("name", "country")

    return list(foundCities) if len(foundCities) > 0 else False
