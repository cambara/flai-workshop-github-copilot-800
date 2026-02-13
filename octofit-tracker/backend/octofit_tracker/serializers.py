from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'team_id', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id)


class TeamSerializer(serializers.ModelSerializer):
    """Serializer for Team model"""
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_at', 'members']
    
    def get_id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id)


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model"""
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = ['id', 'user_id', 'activity_type', 'duration', 'distance', 'calories', 'date', 'notes']
    
    def get_id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id)


class LeaderboardSerializer(serializers.ModelSerializer):
    """Serializer for Leaderboard model"""
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_id', 'user_name', 'team_id', 'team_name', 'total_points', 
                  'total_activities', 'total_calories', 'last_updated']
    
    def get_id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id)


class WorkoutSerializer(serializers.ModelSerializer):
    """Serializer for Workout model"""
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'category', 'difficulty', 'duration', 
                  'calories_estimate', 'instructions']
    
    def get_id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id)
