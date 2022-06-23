#django rest framework serializer
from rest_framework import serializers
from places.models import place

class placeSerializer(serializers.ModelSerializer):
    creator_username = serializers.SerializerMethodField();
    creator_lname_username = serializers.SerializerMethodField();

    def get_creator_username(self, obj):
        return obj.creator.username
    
    def get_creator_lname_username(self, obj):
        return obj.creator.profile.creator_name
    class Meta:
        model = place
        fields = '__all__'