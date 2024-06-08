from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("check-city/<str:city>/", views.verify_city),
]
