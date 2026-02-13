from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """Admin interface for User model"""
    list_display = ['name', 'email', 'team_id', 'created_at']
    search_fields = ['name', 'email']
    list_filter = ['created_at']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    """Admin interface for Team model"""
    list_display = ['name', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    """Admin interface for Activity model"""
    list_display = ['user_id', 'activity_type', 'duration', 'calories', 'date']
    search_fields = ['user_id', 'activity_type']
    list_filter = ['activity_type', 'date']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    """Admin interface for Leaderboard model"""
    list_display = ['user_name', 'team_name', 'total_points', 'total_activities', 'total_calories', 'last_updated']
    search_fields = ['user_name', 'team_name']
    list_filter = ['last_updated']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    """Admin interface for Workout model"""
    list_display = ['name', 'category', 'difficulty', 'duration', 'calories_estimate']
    search_fields = ['name', 'category']
    list_filter = ['category', 'difficulty']
