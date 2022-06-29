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
    queryset = place.objects.all().order_by('-date_posted')
    serializer_class = placeSerializer

class placeCreation(generics.CreateAPIView):
    queryset = place.objects.all()
    serializer_class = placeSerializer

class placeDetail(generics.RetrieveAPIView):
    queryset = place.objects.all()
    serializer_class = placeSerializer

class placeDelete(generics.DestroyAPIView):
    queryset = place.objects.all()
    serializer_class = placeSerializer

class placeUpdate(generics.UpdateAPIView):
    queryset = place.objects.all()
    serializer_class = placeSerializer