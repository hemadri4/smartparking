from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token

import random
from django.utils import timezone
from django.contrib.auth import logout

from .models import User, ParkingSpace, Booking
from .serializers import (
    UserSerializer,
    ParkingSpaceSerializer,
    BookingSerializer
)


# =========================
# PARKING LIST
# =========================

@api_view(['GET'])
def parking_list_api(request):

    parking_spaces = ParkingSpace.objects.filter(
        is_available=True
    )

    serializer = ParkingSpaceSerializer(
        parking_spaces,
        many=True
    )

    return Response(serializer.data)


# =========================
# PARKING DETAILS
# =========================

@api_view(['GET'])
def parking_detail_api(request, parking_id):

    try:
        parking = ParkingSpace.objects.get(
            id=parking_id
        )

    except ParkingSpace.DoesNotExist:

        return Response(
            {'error': 'Parking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ParkingSpaceSerializer(parking)

    return Response(serializer.data)


# =========================
# REGISTER
# =========================

@api_view(['POST'])
def register_api(request):

    username = request.data.get('username')
    password = request.data.get('password')
    full_name = request.data.get('full_name')
    phone = request.data.get('phone')
    email = request.data.get('email')
    role = request.data.get('role')

    if not username or not password or not full_name or not phone or not role:

        return Response(
            {'error': 'All required fields are needed'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():

        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create(
        username=username,
        password=make_password(password),
        full_name=full_name,
        phone=phone,
        email=email,
        role=role
    )

    return Response(
        {
            'message': 'Registration successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'full_name': user.full_name,
                'role': user.role
            }
        },
        status=status.HTTP_201_CREATED
    )


# =========================
# LOGIN
# =========================

@api_view(['POST'])
def login_api(request):

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:

        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)

    return Response({
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'full_name': user.full_name,
            'role': user.role,
        }
    })


# =========================
# CREATE BOOKING
# =========================

@api_view(['POST'])
def create_booking_api(request, parking_id):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        parking = ParkingSpace.objects.get(
            id=parking_id
        )

    except ParkingSpace.DoesNotExist:

        return Response(
            {'error': 'Parking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if parking.occupied_slots >= parking.capacity:

        return Response(
            {'error': 'Parking is full'},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking_date = request.data.get('booking_date')
    start_time = request.data.get('start_time')
    end_time = request.data.get('end_time')

    if not booking_date or not start_time or not end_time:

        return Response(
            {'error': 'All booking details are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking = Booking.objects.create(
        user=request.user,
        parking=parking,
        booking_date=booking_date,
        start_time=start_time,
        end_time=end_time,
        status='pending'
    )

    serializer = BookingSerializer(booking)

    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
    )


# =========================
# MY BOOKINGS
# =========================

@api_view(['GET'])
def my_bookings_api(request):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    bookings = Booking.objects.filter(
        user=request.user
    ).order_by('-created_at')

    serializer = BookingSerializer(
        bookings,
        many=True
    )

    return Response(serializer.data)


# =========================
# OWNER BOOKINGS
# =========================

@api_view(['GET'])
def owner_bookings_api(request):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if request.user.role != 'owner':

        return Response(
            {'error': 'Owner access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    bookings = Booking.objects.filter(
        parking__owner=request.user
    ).order_by('-created_at')

    serializer = BookingSerializer(
        bookings,
        many=True
    )

    return Response(serializer.data)


# =========================
# UPDATE BOOKING STATUS
# =========================

@api_view(['POST'])
def update_booking_status_api(request, booking_id):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if request.user.role != 'owner':

        return Response(
            {'error': 'Owner access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        booking = Booking.objects.get(
            id=booking_id,
            parking__owner=request.user
        )

    except Booking.DoesNotExist:

        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    new_status = request.data.get('status')

    if new_status not in ['confirmed', 'cancelled']:

        return Response(
            {'error': 'Invalid status'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if booking.status != 'pending':

        return Response(
            {'error': 'Only pending bookings can be updated'},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.status = new_status
    booking.save()

    return Response({
        'message': f'Booking {new_status} successfully',
        'booking': BookingSerializer(booking).data
    })


# =========================
# CSRF TOKEN
# =========================

@api_view(['GET'])
@ensure_csrf_cookie
def csrf_api(request):
    return Response({
        'message': 'CSRF cookie set',
        'csrfToken': get_token(request)
    })

# =========================
# GENERATE OTP
# =========================

@api_view(['POST'])
def generate_otp_api(request, booking_id):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        booking = Booking.objects.get(
            id=booking_id,
            user=request.user
        )

    except Booking.DoesNotExist:

        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status != 'confirmed':

        return Response(
            {'error': 'Booking is not confirmed'},
            status=status.HTTP_400_BAD_REQUEST
        )

    otp = str(random.randint(100000, 999999))

    booking.otp = otp
    booking.otp_verified = False
    booking.save()

    return Response({
        'message': 'OTP generated successfully',
        'otp': otp
    })


# =========================
# VERIFY OTP
# =========================

@api_view(['POST'])
def verify_otp_api(request, booking_id):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        booking = Booking.objects.get(
            id=booking_id,
            user=request.user
        )

    except Booking.DoesNotExist:

        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status != 'confirmed':

        return Response(
            {'error': 'Booking is not confirmed'},
            status=status.HTTP_400_BAD_REQUEST
        )

    otp = request.data.get('otp')

    if not otp:

        return Response(
            {'error': 'OTP is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if booking.otp != otp:

        return Response(
            {'error': 'Invalid OTP'},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.otp_verified = True
    booking.save()

    return Response({
        'message': 'OTP verified successfully',
        'booking_id': booking.id
    })


# =========================
# CHECK IN
# =========================

@api_view(['POST'])
def check_in_api(request, booking_id):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        booking = Booking.objects.select_related(
            'parking'
        ).get(
            id=booking_id,
            user=request.user
        )

    except Booking.DoesNotExist:

        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if booking.status != 'confirmed':

        return Response(
            {'error': 'Booking is not confirmed'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not booking.otp_verified:

        return Response(
            {'error': 'OTP verification required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if booking.checked_in:

        return Response(
            {'error': 'Already checked in'},
            status=status.HTTP_400_BAD_REQUEST
        )

    parking = booking.parking

    if parking.occupied_slots >= parking.capacity:

        return Response(
            {'error': 'Parking is full'},
            status=status.HTTP_400_BAD_REQUEST
        )

    booking.checked_in = True
    booking.check_in_time = timezone.now()
    booking.save()

    parking.occupied_slots += 1
    parking.save()

    return Response({
        'message': 'Check-in successful',
        'booking_id': booking.id,
        'check_in_time': booking.check_in_time,
        'occupied_slots': parking.occupied_slots
    })


# =========================
# CHECK OUT
# =========================

@api_view(['POST'])
def check_out_api(request, booking_id):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        booking = Booking.objects.select_related(
            'parking'
        ).get(
            id=booking_id,
            user=request.user
        )

    except Booking.DoesNotExist:

        return Response(
            {'error': 'Booking not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if not booking.checked_in:

        return Response(
            {'error': 'You have not checked in yet'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if booking.checked_out:

        return Response(
            {'error': 'Already checked out'},
            status=status.HTTP_400_BAD_REQUEST
        )

    checkout_time = timezone.now()

    booking.checked_out = True
    booking.check_out_time = checkout_time

    total_seconds = (
        checkout_time - booking.check_in_time
    ).total_seconds()

    total_minutes = max(
        1,
        int(total_seconds / 60)
    )

    booking.total_minutes = total_minutes

    booking.total_price = (
        total_minutes *
        booking.parking.price_per_minute
    )

    booking.status = 'completed'

    booking.save()

    parking = booking.parking

    if parking.occupied_slots > 0:

        parking.occupied_slots -= 1
        parking.save()

    return Response({
        'message': 'Check-out successful',
        'booking_id': booking.id,
        'total_minutes': booking.total_minutes,
        'total_price': booking.total_price,
        'check_out_time': booking.check_out_time,
        'occupied_slots': parking.occupied_slots
    })


# =========================
# LOGOUT
# =========================

@api_view(['POST'])
def logout_api(request):

    logout(request)

    return Response({
        'message': 'Logout successful'
    })


# =========================
# OWNER PARKING
# =========================

@api_view(['GET'])
def owner_parking_api(request):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if request.user.role != 'owner':

        return Response(
            {'error': 'Owner access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    parking_spaces = ParkingSpace.objects.filter(
        owner=request.user
    ).order_by('-created_at')

    serializer = ParkingSpaceSerializer(
        parking_spaces,
        many=True
    )

    return Response(serializer.data)


# =========================
# ADD PARKING
# =========================

@api_view(['POST'])
def add_parking_api(request):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if request.user.role != 'owner':

        return Response(
            {'error': 'Owner access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    parking = ParkingSpace.objects.create(
        owner=request.user,
        parking_name=request.data.get('parking_name'),
        address=request.data.get('address'),
        city=request.data.get('city'),
        latitude=request.data.get('latitude'),
        longitude=request.data.get('longitude'),
        capacity=request.data.get('capacity'),
        price_per_minute=request.data.get('price_per_minute'),
        description=request.data.get('description', ''),
        is_available=True
    )

    serializer = ParkingSpaceSerializer(parking)

    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
    )


# =========================
# GOVERNMENT DASHBOARD
# =========================

@api_view(['GET'])
def government_dashboard_api(request):

    if not request.user.is_authenticated:

        return Response(
            {'error': 'Login required'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if request.user.role != 'governement':

        return Response(
            {'error': 'Government access required'},
            status=status.HTTP_403_FORBIDDEN
        )

    parking_spaces = ParkingSpace.objects.all()
    bookings = Booking.objects.all()

    total_parking = parking_spaces.count()

    total_capacity = sum(
        parking.capacity
        for parking in parking_spaces
    )

    occupied_slots = sum(
        parking.occupied_slots
        for parking in parking_spaces
    )

    total_bookings = bookings.count()

    pending_bookings = bookings.filter(
        status='pending'
    ).count()

    confirmed_bookings = bookings.filter(
        status='confirmed'
    ).count()

    completed_bookings = bookings.filter(
        status='completed'
    ).count()

    return Response({
        'total_parking_spaces': total_parking,
        'total_capacity': total_capacity,
        'occupied_slots': occupied_slots,
        'available_slots': (
            total_capacity - occupied_slots
        ),
        'total_bookings': total_bookings,
        'pending_bookings': pending_bookings,
        'confirmed_bookings': confirmed_bookings,
        'completed_bookings': completed_bookings,
    })