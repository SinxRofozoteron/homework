from django.http import HttpResponse, JsonResponse

from .utils import check_city


def verify_city(_, user_input):
    suggestions = check_city(user_input)
    if suggestions is True:
        return HttpResponse(status=204)
    return JsonResponse(suggestions, status=200, safe=False)
