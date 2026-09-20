from rest_framework import serializers
from .models import User, ParkingSpace, Booking


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'full_name',
            'phone',
            'role',
            'email',
        ]


class ParkingSpaceSerializer(serializers.ModelSerializer):

    owner = UserSerializer(read_only=True)

    class Meta:
        model = ParkingSpace
        fields = [
            'id',
            'owner',
            'parking_name',
            'address',
            'city',
            'latitude',
            'longitude',
            'capacity',
            'occupied_slots',
            'price_per_minute',
            'description',
            'is_available',
            'created_at',
        ]


class BookingSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)
    parking = ParkingSpaceSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'