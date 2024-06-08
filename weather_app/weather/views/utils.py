import difflib

from weather.models import City


# check if city exists in the database
# and return suggestions if not
def check_city(city: str):
    normalized_city = city.lower()
    try:
        City.objects.get(name=normalized_city)
        return True
    except City.DoesNotExist:
        all_names = City.objects.values_list("name", flat=True)
        closest_matches = difflib.get_close_matches(
            normalized_city, all_names, n=5, cutoff=0.8
        )

    return closest_matches
