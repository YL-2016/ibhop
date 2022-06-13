from .serializers import placeSerializer
from places.models import place
from rest_framework import generics


#EXAMPLE
#from django.contrib.auth.models import User
#from myapp.serializers import UserSerializer
#from rest_framework import generics
#from rest_framework.permissions import IsAdminUser

#class UserList(generics.ListCreateAPIView):
    #queryset = User.objects.all()
    #serializer_class = UserSerializer
    #permission_classes = [IsAdminUser]


class placeList(generics.ListAPIView):
    queryset = place.objects.all()
    serializer_class = placeSerializer