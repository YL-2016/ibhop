"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from places.api import views as places_api_views
from users.api import views as users_api_views

from django.conf import settings
from django.conf.urls.static import static

#https://www.django-rest-framework.org/tutorial/3-class-based-views/
#https://docs.djangoproject.com/en/4.0/howto/static-files/
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/places/', places_api_views.placeList.as_view()),
    path('api/places/create/', places_api_views.placeCreation.as_view()),
    path('api/places/<int:pk>/', places_api_views.placeDetail.as_view()),
    path('api/places/<int:pk>/delete/', places_api_views.placeDelete.as_view()),
    path('api/places/<int:pk>/update/', places_api_views.placeUpdate.as_view()),
    path('api/profiles/', users_api_views.ProfileList.as_view()),
    path('api/profiles/<int:creator>/', users_api_views.ProfileDetail.as_view()),
    path('api/profiles/<int:creator>/update/', users_api_views.ProfileUpdate.as_view()),

    path('api-auth/', include('djoser.urls')),
    path('api-auth/', include('djoser.urls.authtoken')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

