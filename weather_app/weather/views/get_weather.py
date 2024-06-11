import openmeteo_requests
import requests_cache
from django.http import JsonResponse
from openmeteo_sdk.Variable import Variable
from retry_requests import retry
from weather.models import City

from .utils import check_city

cache_session = requests_cache.CachedSession(".cache", expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)


def get_weather(_, user_input: str):
    separated = user_input.split(",")
    city = separated[0].strip().title()
    country = separated[1].strip().title() if len(separated) > 1 else None
    if country:
        try:
            record = City.objects.get(name=city, country=country)

            weather_request_params = {
                "latitude": record.lat,
                "longitude": record.lng,
                "current": ["temperature_2m", "precipitation", "wind_speed_10m"],
            }
            responses = openmeteo.weather_api(
                "https://api.open-meteo.com/v1/forecast", params=weather_request_params
            )
            current = responses[0].Current()
            current_variables = list(
                map(lambda i: current.Variables(i), range(0, current.VariablesLength()))
            )

            temperature, precipitation, wind_speed = None, None, None
            for variable in current_variables:
                match variable.Variable():
                    case Variable.temperature:
                        temperature = variable.Value()
                    case Variable.precipitation:
                        precipitation = variable.Value()
                    case Variable.wind_speed:
                        wind_speed = variable.Value()

            response_json = {
                "city": city,
                "country": country,
                "temperature": temperature,
                "precipitation": precipitation,
                "wind_speed": wind_speed,
            }

            return JsonResponse(response_json, status=200)
        except City.DoesNotExist:
            pass

    suggestions = check_city(user_input)
    response_json = {
        "error": "Unable to find weather for the provided city.",
        "suggestions": suggestions,
    }
    return JsonResponse(response_json, status=400)
