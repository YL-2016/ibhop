from django.contrib import admin
from places.models import place
from .forms import PlaceForm
# Register your models here.

class placeAdmin(admin.ModelAdmin):
    form = PlaceForm

admin.site.register(place, placeAdmin)