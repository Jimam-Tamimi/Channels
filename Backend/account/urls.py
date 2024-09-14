# your_app/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .apis import  CustomTokenVerifyView, CustomTokenObtainPairView, CustomTokenRefreshView, ProfileViewSet, UserViewSet
from rest_framework.routers import SimpleRouter
router = SimpleRouter()

router.register(r'users', UserViewSet)
router.register(r'profiles', ProfileViewSet, basename='profile')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', CustomTokenVerifyView.as_view(), name='token_verify'),
] + router.urls
