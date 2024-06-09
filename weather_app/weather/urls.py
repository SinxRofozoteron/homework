from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("check-city/<str:user_input>/", views.verify_city),
    path("<str:user_input>/", views.get_weather),
]
