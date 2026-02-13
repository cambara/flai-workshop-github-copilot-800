from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes - A team of extraordinary individuals united to protect the world',
            members=[]
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League - The world\'s greatest superheroes working together to defend Earth',
            members=[]
        )
        self.stdout.write(self.style.SUCCESS(f'Created teams: {team_marvel.name}, {team_dc.name}'))

        # Create Marvel Users
        self.stdout.write('Creating Marvel users...')
        marvel_users = [
            {
                'name': 'Tony Stark',
                'email': 'ironman@marvel.com',
                'password': 'jarvis2024',
                'team': team_marvel
            },
            {
                'name': 'Steve Rogers',
                'email': 'captainamerica@marvel.com',
                'password': 'shield1940',
                'team': team_marvel
            },
            {
                'name': 'Natasha Romanoff',
                'email': 'blackwidow@marvel.com',
                'password': 'redroom2024',
                'team': team_marvel
            },
            {
                'name': 'Thor Odinson',
                'email': 'thor@marvel.com',
                'password': 'mjolnir123',
                'team': team_marvel
            },
            {
                'name': 'Bruce Banner',
                'email': 'hulk@marvel.com',
                'password': 'gamma2024',
                'team': team_marvel
            },
        ]

        # Create DC Users
        self.stdout.write('Creating DC users...')
        dc_users = [
            {
                'name': 'Clark Kent',
                'email': 'superman@dc.com',
                'password': 'krypton2024',
                'team': team_dc
            },
            {
                'name': 'Bruce Wayne',
                'email': 'batman@dc.com',
                'password': 'gotham2024',
                'team': team_dc
            },
            {
                'name': 'Diana Prince',
                'email': 'wonderwoman@dc.com',
                'password': 'themyscira2024',
                'team': team_dc
            },
            {
                'name': 'Barry Allen',
                'email': 'flash@dc.com',
                'password': 'speedforce2024',
                'team': team_dc
            },
            {
                'name': 'Arthur Curry',
                'email': 'aquaman@dc.com',
                'password': 'atlantis2024',
                'team': team_dc
            },
        ]

        created_users = []
        user_team_map = {}  # Map user to their team object
        for user_data in marvel_users + dc_users:
            user = User.objects.create(
                name=user_data['name'],
                email=user_data['email'],
                password=user_data['password'],
                team_id=str(user_data['team']._id)
            )
            created_users.append(user)
            user_team_map[str(user._id)] = user_data['team']
            self.stdout.write(f'  Created user: {user.name}')

        # Create Activities for each user
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing', 'HIIT']
        
        for user in created_users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                days_ago = random.randint(1, 30)
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                distance = round(random.uniform(2.0, 15.0), 2) if activity_type in ['Running', 'Cycling', 'Swimming'] else None
                calories = duration * random.randint(5, 12)
                
                Activity.objects.create(
                    user_id=str(user._id),
                    activity_type=activity_type,
                    duration=duration,
                    distance=distance,
                    calories=calories,
                    date=datetime.now() - timedelta(days=days_ago),
                    notes=f'{activity_type} session by {user.name}'
                )
        
        activity_count = Activity.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Created {activity_count} activities'))

        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        for user in created_users:
            user_activities = Activity.objects.filter(user_id=str(user._id))
            total_calories = sum(activity.calories for activity in user_activities)
            total_points = total_calories + (user_activities.count() * 100)
            
            team = user_team_map[str(user._id)]
            
            Leaderboard.objects.create(
                user_id=str(user._id),
                user_name=user.name,
                team_id=str(team._id),
                team_name=team.name,
                total_points=total_points,
                total_activities=user_activities.count(),
                total_calories=total_calories
            )
        
        leaderboard_count = Leaderboard.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Created {leaderboard_count} leaderboard entries'))

        # Create Workout suggestions
        self.stdout.write('Creating workout suggestions...')
        workouts = [
            {
                'name': 'Iron Man Cardio Blast',
                'description': 'High-intensity cardio workout to build endurance like Tony Stark in his suit',
                'category': 'Cardio',
                'difficulty': 'Advanced',
                'duration': 45,
                'calories_estimate': 500,
                'instructions': [
                    'Warm up for 5 minutes with light jogging',
                    'Sprint intervals: 30 seconds sprint, 30 seconds rest (10 rounds)',
                    'Burpees: 3 sets of 15 reps',
                    'Mountain climbers: 3 sets of 30 seconds',
                    'Cool down with 5 minutes of walking'
                ]
            },
            {
                'name': 'Captain America Strength Training',
                'description': 'Build super-soldier strength with this compound movement workout',
                'category': 'Strength',
                'difficulty': 'Intermediate',
                'duration': 60,
                'calories_estimate': 400,
                'instructions': [
                    'Bench press: 4 sets of 8-10 reps',
                    'Deadlifts: 4 sets of 6-8 reps',
                    'Pull-ups: 3 sets to failure',
                    'Squats: 4 sets of 10 reps',
                    'Shoulder press: 3 sets of 10 reps'
                ]
            },
            {
                'name': 'Black Widow Flexibility Flow',
                'description': 'Enhance flexibility and mobility with this yoga-inspired routine',
                'category': 'Flexibility',
                'difficulty': 'Beginner',
                'duration': 30,
                'calories_estimate': 150,
                'instructions': [
                    'Cat-cow stretches: 2 minutes',
                    'Downward dog: Hold for 1 minute',
                    'Warrior poses: 2 minutes each side',
                    'Pigeon pose: 2 minutes each side',
                    'Child\'s pose: 3 minutes'
                ]
            },
            {
                'name': 'Superman Power Circuit',
                'description': 'Build total body power with explosive movements',
                'category': 'HIIT',
                'difficulty': 'Advanced',
                'duration': 40,
                'calories_estimate': 550,
                'instructions': [
                    'Box jumps: 4 sets of 12 reps',
                    'Medicine ball slams: 4 sets of 15 reps',
                    'Battle ropes: 4 sets of 30 seconds',
                    'Kettlebell swings: 4 sets of 20 reps',
                    'Plank: Hold for 2 minutes'
                ]
            },
            {
                'name': 'Wonder Woman Core Crusher',
                'description': 'Develop an unbreakable core with this targeted workout',
                'category': 'Core',
                'difficulty': 'Intermediate',
                'duration': 25,
                'calories_estimate': 200,
                'instructions': [
                    'Plank variations: 3 sets of 1 minute each',
                    'Russian twists: 3 sets of 30 reps',
                    'Bicycle crunches: 3 sets of 25 reps',
                    'Leg raises: 3 sets of 15 reps',
                    'Dead bug: 3 sets of 20 reps'
                ]
            },
            {
                'name': 'Flash Speed Training',
                'description': 'Develop lightning-fast speed and agility',
                'category': 'Speed',
                'difficulty': 'Intermediate',
                'duration': 35,
                'calories_estimate': 400,
                'instructions': [
                    'Ladder drills: 10 minutes',
                    'Sprint intervals: 8 x 100m with 60 seconds rest',
                    'Cone drills: 5 minutes',
                    'High knees: 3 sets of 30 seconds',
                    'Cool down jog: 5 minutes'
                ]
            },
        ]

        for workout_data in workouts:
            Workout.objects.create(**workout_data)
            self.stdout.write(f'  Created workout: {workout_data["name"]}')

        workout_count = Workout.objects.count()
        self.stdout.write(self.style.SUCCESS(f'Created {workout_count} workout suggestions'))

        # Print summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*50))
        self.stdout.write(self.style.SUCCESS('Database population completed successfully!'))
        self.stdout.write(self.style.SUCCESS('='*50))
        self.stdout.write(f'Teams: {Team.objects.count()}')
        self.stdout.write(f'Users: {User.objects.count()}')
        self.stdout.write(f'Activities: {Activity.objects.count()}')
        self.stdout.write(f'Leaderboard entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'Workouts: {Workout.objects.count()}')
        self.stdout.write(self.style.SUCCESS('='*50))
