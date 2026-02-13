from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.filters import OrderingFilter, SearchFilter
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import (
    UserSerializer, TeamSerializer, ActivitySerializer,
    LeaderboardSerializer, WorkoutSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for users with pagination, sorting, and filtering
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['name', 'email', 'created_at']  # Only database fields
    ordering = ['name']  # Default ordering
    search_fields = ['name', 'email']


class TeamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for teams
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint for activities
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint for leaderboard
    """
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint for workouts
    """
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
