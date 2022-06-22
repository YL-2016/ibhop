#django rest framework serializer
from rest_framework import serializers
from places.models import place

class placeSerializer(serializers.ModelSerializer):
    creator_username = serializers.SerializerMethodField();
    def get_creator_username(self, obj):
        return obj.creator.username
    class Meta:
        model = place
        fields = '__all__'