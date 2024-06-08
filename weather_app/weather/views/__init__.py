from django.shortcuts import render

from .verify_city import *


def index(request):
    return render(request, "weather/index.html")
