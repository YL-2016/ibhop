#django rest framework serializer
from rest_framework import serializers
from places.models import place

class placeSerializer(serializers.ModelSerializer):
    class Meta:
        model = place
        fields = '__all__'