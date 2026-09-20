from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = (
        ('user','User'),
        ('owner', 'Parking Owner'),
        ('governement', 'Government'),
        
    )
    

    full_name = models.CharField(max_length=100)

    phone = models.CharField(max_length=15)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='user'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username 

class ParkingSpace(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='parking_spaces'
    )

    parking_name = models.CharField(max_length=100)

    address = models.TextField()

    city = models.CharField(max_length=50)

    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6
    )

    capacity = models.PositiveIntegerField()
    occupied_slots = models.PositiveIntegerField(default=0)

    price_per_minute = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    description = models.TextField(blank=True)

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.parking_name
class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    parking = models.ForeignKey(
        ParkingSpace,
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    booking_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    otp = models.CharField(
        max_length=6,
        blank=True,
        null=True
    )

    otp_verified = models.BooleanField(default=False)
    checked_in = models.BooleanField(default=False)

    check_in_time = models.DateTimeField(null=True,blank=True)
    checked_out = models.BooleanField(default=False)

    check_out_time = models.DateTimeField(null=True,blank=True)

    total_minutes = models.PositiveIntegerField(
    null=True,
    blank=True
    )

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
        )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.parking.parking_name}"