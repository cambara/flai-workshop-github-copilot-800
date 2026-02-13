from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import datetime
from .models import User, Team, Activity, Leaderboard, Workout


class UserModelTest(TestCase):
    """Test cases for User model"""
    
    def setUp(self):
        self.user = User.objects.create(
            name="Test User",
            email="test@example.com",
            password="testpass123"
        )
    
    def test_user_creation(self):
        """Test user model creation"""
        self.assertEqual(self.user.name, "Test User")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertIsNotNone(self.user._id)


class TeamModelTest(TestCase):
    """Test cases for Team model"""
    
    def setUp(self):
        self.team = Team.objects.create(
            name="Test Team",
            description="A test team",
            members=[]
        )
    
    def test_team_creation(self):
        """Test team model creation"""
        self.assertEqual(self.team.name, "Test Team")
        self.assertEqual(self.team.description, "A test team")
        self.assertIsNotNone(self.team._id)


class ActivityModelTest(TestCase):
    """Test cases for Activity model"""
    
    def setUp(self):
        self.activity = Activity.objects.create(
            user_id="user123",
            activity_type="Running",
            duration=30,
            calories=300,
            date=datetime.now()
        )
    
    def test_activity_creation(self):
        """Test activity model creation"""
        self.assertEqual(self.activity.activity_type, "Running")
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.calories, 300)
        self.assertIsNotNone(self.activity._id)


class LeaderboardModelTest(TestCase):
    """Test cases for Leaderboard model"""
    
    def setUp(self):
        self.leaderboard_entry = Leaderboard.objects.create(
            user_id="user123",
            user_name="Test User",
            total_points=100,
            total_activities=5,
            total_calories=500
        )
    
    def test_leaderboard_creation(self):
        """Test leaderboard model creation"""
        self.assertEqual(self.leaderboard_entry.user_name, "Test User")
        self.assertEqual(self.leaderboard_entry.total_points, 100)
        self.assertIsNotNone(self.leaderboard_entry._id)


class WorkoutModelTest(TestCase):
    """Test cases for Workout model"""
    
    def setUp(self):
        self.workout = Workout.objects.create(
            name="Test Workout",
            description="A test workout",
            category="Cardio",
            difficulty="Medium",
            duration=45,
            calories_estimate=400,
            instructions=["Step 1", "Step 2"]
        )
    
    def test_workout_creation(self):
        """Test workout model creation"""
        self.assertEqual(self.workout.name, "Test Workout")
        self.assertEqual(self.workout.category, "Cardio")
        self.assertEqual(self.workout.difficulty, "Medium")
        self.assertIsNotNone(self.workout._id)


class APIEndpointTest(APITestCase):
    """Test cases for API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_users_endpoint(self):
        """Test users endpoint"""
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_teams_endpoint(self):
        """Test teams endpoint"""
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_activities_endpoint(self):
        """Test activities endpoint"""
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_leaderboard_endpoint(self):
        """Test leaderboard endpoint"""
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_workouts_endpoint(self):
        """Test workouts endpoint"""
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
