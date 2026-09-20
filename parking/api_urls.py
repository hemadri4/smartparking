from django.urls import path
from . import api_views

urlpatterns = [
    path('csrf/', api_views.csrf_api),

    path(
        'parking/',
        api_views.parking_list_api,
        name='parking_list_api'
    ),

    path(
        'parking/<int:parking_id>/',
        api_views.parking_detail_api,
        name='parking_detail_api'
    ),

    path(
        'register/',
        api_views.register_api,
        name='register_api'
    ),

    path(
        'login/',
        api_views.login_api,
        name='login_api'
    ),

    path(
        'booking/<int:parking_id>/',
        api_views.create_booking_api,
        name='create_booking_api'
    ),

    path(
        'my-bookings/',
        api_views.my_bookings_api,
        name='my_bookings_api'
    ),
    path('owner-bookings/', api_views.owner_bookings_api, name='owner_bookings_api'),

    path('booking/<int:booking_id>/status/',
         api_views.update_booking_status_api,name='update_booking_status_api'),
    path(
    'booking/<int:booking_id>/generate-otp/',
    api_views.generate_otp_api
    ),
    path(
    'booking/<int:booking_id>/verify-otp/',
    api_views.verify_otp_api
    ),
    path(
    'booking/<int:booking_id>/check-in/',
    api_views.check_in_api
    ),
    path(
    'booking/<int:booking_id>/check-out/',
    api_views.check_out_api
    ),
    path('logout/', api_views.logout_api),
    path('owner-parking/', api_views.owner_parking_api),

    path('add-parking/', api_views.add_parking_api),
    path('government-dashboard/',api_views.government_dashboard_api),
]