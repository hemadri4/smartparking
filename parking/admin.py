from django.contrib import admin
from .models import User, ParkingSpace, Booking


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'username',
        'full_name',
        'phone',
        'role',
        'created_at',
    )

    list_filter = ('role',)

    search_fields = (
        'username',
        'full_name',
        'phone',
    )


@admin.register(ParkingSpace)
class ParkingSpaceAdmin(admin.ModelAdmin):
    list_display = (
        'parking_name',
        'owner',
        'city',
        'capacity',
        'occupied_slots',
        'price_per_minute',
        'is_available',
    )

    list_filter = (
        'city',
        'is_available',
    )

    search_fields = (
        'parking_name',
        'city',
        'address',
    )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'parking',
        'booking_date',
        'start_time',
        'end_time',
        'status',
        'otp_verified',
        'checked_in',
        'checked_out',
        'total_minutes',
        'total_price',
    )

    list_filter = (
        'status',
        'otp_verified',
        'checked_in',
        'checked_out',
    )

    search_fields = (
        'user__username',
        'parking__parking_name',
    )