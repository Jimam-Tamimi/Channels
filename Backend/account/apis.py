# your_app/views.py

from time import sleep
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken

class UserViewSet(ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
   
 
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        # Extract the username/email and password from the request
        username_or_email = request.data.get('username')
        password = request.data.get('password')
        # Authenticate the user using either username or email
        user = authenticate(request, username=username_or_email, password=password)
        
        if user is None:
            # If authentication fails, return an error
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Serialize the user data
        user_serializer = UserSerializer(user)
        
        # Return the tokens and user data in the response
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_serializer.data
        })

    
    
    
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data

        # Get the user based on the token's user_id claim
        user = self.get_user_from_token(response.data['access'])
        user_serializer = UserSerializer(user)

        # Include user data in the response
        data['user'] = user_serializer.data
        return Response(data, status=status.HTTP_200_OK)\

# your_app/views.py (continued)



class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        # Call the parent class method to verify the token
        response = super().post(request, *args, **kwargs)
        data = response.data

        # Extract the token from the request data
        token = request.data.get('token')
        if token:
            decoded_token = AccessToken(token)
            user_id = decoded_token['user_id']
            User = get_user_model()
            user = User.objects.get(id=user_id)
            user_serializer = UserSerializer(user)

            # Include user data in the response
            data['user'] = user_serializer.data

        return Response(data, status=status.HTTP_200_OK)