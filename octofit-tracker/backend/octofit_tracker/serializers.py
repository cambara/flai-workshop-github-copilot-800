from rest_framework import serializers
from bson import ObjectId
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    id = serializers.SerializerMethodField()
    team_name = serializers.SerializerMethodField()
    activities = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password', 'team_id', 'team_name', 'activities', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_id(self, obj):
        """Convert ObjectId to string"""
        return str(obj._id)
    
    def get_team_name(self, obj):
        """Get team name from team_id"""
        if obj.team_id:
            try:
                # Convert string team_id to ObjectId
                team_object_id = ObjectId(obj.team_id)
                team = Team.objects.get(_id=team_object_id)
                return team.name
            except (Team.DoesNotExist, Exception) as e:
                return None
        return None
    
    def get_activities(self, obj):
        """Get activities for this user"""
        user_id = str(obj._id)
        activities = Activity.objects.filter(user_id=user_id).order_by('-date')[:5]  # Get last 5 activities
        return ActivitySerializer(activities, many=True).data


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
