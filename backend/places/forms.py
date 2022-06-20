# from django import forms
# from .models import place
# from django.contrib.gis.geos import Point

# class PlaceForm(forms.ModelForm):
#     class Meta:
#         model = place
#         fields = ['title', 'description', 'area', 'place_type', 
#         'entry_fee', 'buddy_num', 'date_posted', 'location', 
#         'latitude', 'longtitude', 'pic', 'pic1', 'pic2', 'pic3']

#     latitude = forms.FloatField()
#     longtitude = forms.FloatField()

#     def clean(self):
#         #access form itself
#         data = super().clean()
#         latitude = data.pop('latitude')
#         longtitude = data.pop('longtitude')
#         data['location'] = Point(latitude, longtitude, srid=4326)
#         return data
    
#     #override __init__ to display lat & long
#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         location = self.initial.get('location')
#         if isinstance(location, Point):
#             # location is point field (we can do tuple[])
#             self.initial['latitude'] = location.tuple[0]
#             self.initial['longtitude'] = location.tuple[1]