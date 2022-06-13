from django.contrib.gis.db import models
from random import choices
from django.utils import timezone
from django.contrib.gis.geos import Point
from django.contrib.auth.models import AbstractUser

# Create your models here.
class place(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    choices_area=(
        ('CA', 'Within the Canada'),
        ('Abroad', 'Outside the Canada'),
    )
    area = models.CharField(max_length=30, blank=True, null=True, choices=choices_area)
    choices_place_type=(
        ('Library', 'Library'),
        ('Conservation Park', 'Conservation Park'),
        ('Gallery', 'Gallery'),
        ('Playground', 'Playground'),
    )
    place_type = models.CharField(max_length=30, choices=choices_place_type)
    choices_parking=(
        ('free', 'free parking'),
        ('hour', )
    )
    entry_fee = models.DecimalField(max_digits=60, decimal_places=2)
    choices_parking=(
        ('free', 'free'),
        ('per hour', 'per hour'),
        ('per day', 'per day'),
    )
    parking = models.CharField(max_length=30,blank=True, null=True, choices=choices_parking)
    buddy_num = models.IntegerField(blank=True, null=True)
    date_posted = models.DateTimeField(default=timezone.now)
    #USE spatial data using longitude and latitude coordinates on the Earth's surface 
    #as defined in the WGS84 standard
    location = models.PointField(blank=True, null=True, srid=4326)

    pic = models.ImageField(blank=True, null=True, upload_to='pic/%Y/%m/%d/')
    pic1 = models.ImageField(blank=True, null=True, upload_to='pic/%Y/%m/%d/')
    pic2 = models.ImageField(blank=True, null=True, upload_to='pic/%Y/%m/%d/')
    pic3 = models.ImageField(blank=True, null=True, upload_to='pic/%Y/%m/%d/')
    # display place title instead of displaying place object(1)
    def __str__(self):
        return self.title