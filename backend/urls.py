"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import path
from django.urls import path, include

from parking.views import (
    register,
    add_parking,
    user_login,
    logout_user,
    owner_dashboard,
    parking_list,
    parking_detail,
    create_booking,
    booking_confirmation,
    my_bookings,
    owner_bookings,
    update_booking_status,
    verify_otp,
    check_in,
    check_out,
)


urlpatterns = [

    # Admin
    path(
        'admin/',
        admin.site.urls
    ),

    # Authentication
    path(
        'register/',
        register,
        name='register'
    ),

    path(
        'login/',
        user_login,
        name='login'
    ),

    path(
        'logout/',
        logout_user,
        name='logout'
    ),

    # Owner
    path(
        'add-parking/',
        add_parking,
        name='add_parking'
    ),

    path(
        'owner-dashboard/',
        owner_dashboard,
        name='owner_dashboard'
    ),

    path(
        'owner-bookings/',
        owner_bookings,
        name='owner_bookings'
    ),

    # Parking
    path(
        'parking-list/',
        parking_list,
        name='parking_list'
    ),

    path(
        'parking/<int:parking_id>/',
        parking_detail,
        name='parking_detail'
    ),

    # Booking
    path(
        'booking/<int:parking_id>/',
        create_booking,
        name='create_booking'
    ),

    path(
        'booking-confirmation/<int:booking_id>/',
        booking_confirmation,
        name='booking_confirmation'
    ),

    path(
        'my-bookings/',
        my_bookings,
        name='my_bookings'
    ),

    # Owner booking actions
    path(
        'booking/<int:booking_id>/confirm/',
        update_booking_status,
        {'status': 'confirmed'},
        name='confirm_booking'
    ),

    path(
        'booking/<int:booking_id>/cancel/',
        update_booking_status,
        {'status': 'cancelled'},
        name='cancel_booking'
    ),

    # OTP
    path(
        'verify-otp/<int:booking_id>/',
        verify_otp,
        name='verify_otp'
    ),

    # Check-in / Check-out
    path(
        'check-in/<int:booking_id>/',
        check_in,
        name='check_in'
    ),

    path(
        'check-out/<int:booking_id>/',
        check_out,
        name='check_out'
    ),
    path(
    'owner-bookings/',
    owner_bookings,
    name='owner_bookings'
),
path('api/', include('parking.api_urls')),
]