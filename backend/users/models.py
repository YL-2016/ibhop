from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)

class Profile(models.Model):
    creator = models.OneToOneField(User, on_delete=models.CASCADE)
    creator_name = models.CharField(max_length=200, null=True, blank=True)
    email_address = models.CharField(max_length=500, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/%Y/%m/%d/',null=True, blank=True)
    def __str__(self) -> str:
        return f"This is the profile of {self.creator.username}"