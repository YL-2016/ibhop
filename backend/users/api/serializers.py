#django rest framework serializer
from rest_framework import serializers
from users.models import Profile
from places.models import place
#to enable the place serializer
from places.api.serializers import placeSerializer

class ProfileSerializer(serializers.ModelSerializer):
    buddy_places_list = serializers.SerializerMethodField();
    def get_buddy_places_list(self, obj):
        #places_list = place.objects.all()
        #only user's own places
        places_list = place.objects.filter(creator=obj.creator)
        places_list_serialized = placeSerializer(places_list, many=True)
        #need to return .data!!!!
        return places_list_serialized.data
    class Meta:
        model = Profile
        fields = '__all__'