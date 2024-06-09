from django.shortcuts import render

from .get_weather import *
from .verify_city import *


def index(request):
    return render(request, "weather/index.html")
