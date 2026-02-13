from django.db import models
from djongo import models as djongo_models


class User(djongo_models.Model):
    """User model for OctoFit Tracker"""
    _id = djongo_models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    team_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return self.name


class Team(djongo_models.Model):
    """Team model for OctoFit Tracker"""
    _id = djongo_models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.JSONField(default=list)
    
    class Meta:
        db_table = 'teams'
    
    def __str__(self):
        return self.name


class Activity(djongo_models.Model):
    """Activity model for OctoFit Tracker"""
    _id = djongo_models.ObjectIdField(primary_key=True)
    user_id = models.CharField(max_length=100)
    activity_type = models.CharField(max_length=100)
    duration = models.IntegerField()  # in minutes
    distance = models.FloatField(blank=True, null=True)  # in km
    calories = models.IntegerField()
    date = models.DateTimeField()
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'activities'
    
    def __str__(self):
        return f"{self.activity_type} - {self.duration} mins"


class Leaderboard(djongo_models.Model):
    """Leaderboard model for OctoFit Tracker"""
    _id = djongo_models.ObjectIdField(primary_key=True)
    user_id = models.CharField(max_length=100)
    user_name = models.CharField(max_length=200)
    team_id = models.CharField(max_length=100, blank=True, null=True)
    team_name = models.CharField(max_length=200, blank=True, null=True)
    total_points = models.IntegerField(default=0)
    total_activities = models.IntegerField(default=0)
    total_calories = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'leaderboard'
    
    def __str__(self):
        return f"{self.user_name} - {self.total_points} points"


class Workout(djongo_models.Model):
    """Workout suggestion model for OctoFit Tracker"""
    _id = djongo_models.ObjectIdField(primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)
    duration = models.IntegerField()  # in minutes
    calories_estimate = models.IntegerField()
    instructions = models.JSONField(default=list)
    
    class Meta:
        db_table = 'workouts'
    
    def __str__(self):
        return self.name
