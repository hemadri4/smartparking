from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import User, ParkingSpace, Booking
from django.contrib.auth.decorators import login_required
from datetime import datetime
import random
from django.utils import timezone


def register(request):

    if request.method == "POST":

        username = request.POST['username']
        password = request.POST['password']
        full_name = request.POST['full_name']
        phone = request.POST['phone']
        role = request.POST['role']

        user = User.objects.create_user(
            username=username,
            password=password,
            full_name=full_name,
            phone=phone,
            role=role
        )

        login(request, user)

        return redirect('add_parking')

    return render(request, 'register.html')

@login_required
def add_parking(request):

    if request.user.role != 'owner':
        return render(request, 'not_allowed.html')

    if request.method == "POST":

        ParkingSpace.objects.create(
            owner=request.user,
            parking_name=request.POST['parking_name'],
            address=request.POST['address'],
            city=request.POST['city'],
            latitude=request.POST['latitude'],
            longitude=request.POST['longitude'],
            capacity=request.POST['capacity'],
            price_per_minute=request.POST['price_per_minute'],
            description=request.POST['description']
        )

        return redirect('add_parking')

    return render(request, 'add_parking.html')
def user_login(request):

    if request.method == "POST":

        username = request.POST['username']
        password = request.POST['password']

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:

            login(request, user)

            return redirect('add_parking')

        else:

            return render(
                request,
                'login.html',
                {'error': 'Invalid username or password'}
            )

    return render(request, 'login.html')
def logout_user(request):
    logout(request)
    return redirect('login')
@login_required
def owner_dashboard(request):

    parking_spaces = ParkingSpace.objects.filter(owner=request.user)

    return render(
        request,
        'owner_dashboard.html',
        {'parking_spaces': parking_spaces}
    )
@login_required
def parking_list(request):

    parking_spaces = ParkingSpace.objects.all()

    return render(
        request,
        'parking_list.html',
        {'parking_spaces': parking_spaces}
    )
@login_required
def parking_detail(request, parking_id):

    parking = ParkingSpace.objects.get(id=parking_id)

    return render(
        request,
        'parking_detail.html',
        {'parking': parking}
    )
@login_required
def create_booking(request, parking_id):
    parking = ParkingSpace.objects.get(id=parking_id)
    if parking.occupied_slots >= parking.capacity:
        return render(
        request,
        'booking.html',
        {
            'parking': parking,
            'error': 'No parking slots are currently available.'
        }
    )

    if request.method == "POST":
        booking_date = request.POST['booking_date']
        start_time = request.POST['start_time']
        end_time = request.POST['end_time']

        booking = Booking.objects.create(
            user=request.user,
            parking=parking,
            booking_date=booking_date,
            start_time=start_time,
            end_time=end_time
        )

        return redirect(
            'booking_confirmation',
            booking_id=booking.id
        )

    return render(
        request,
        'booking.html',
        {'parking': parking}
    )
@login_required
def booking_confirmation(request, booking_id):
    booking = Booking.objects.get(id=booking_id)

    # Only the user who made the booking can view it
    if booking.user != request.user:
        return render(request, 'not_allowed.html')

    start = datetime.combine(
        booking.booking_date,
        booking.start_time
    )

    end = datetime.combine(
        booking.booking_date,
        booking.end_time
    )

    duration = end - start

    total_minutes = int(duration.total_seconds() / 60)

    price_per_minute = booking.parking.price_per_minute

    total_price = total_minutes * price_per_minute

    return render(
        request,
        'booking_confirmation.html',
        {
            'booking': booking,
            'total_minutes': total_minutes,
            'total_price': total_price
        }
    )
@login_required
def create_booking(request, parking_id):
    parking = ParkingSpace.objects.get(id=parking_id)

    if request.method == "POST":
        booking_date = request.POST['booking_date']
        start_time = request.POST['start_time']
        end_time = request.POST['end_time']

        # Convert time strings to datetime objects
        start = datetime.strptime(start_time, "%H:%M")
        end = datetime.strptime(end_time, "%H:%M")

        # Check invalid time
        if end <= start:
            return render(
                request,
                'booking.html',
                {
                    'parking': parking,
                    'error': 'End time must be after start time.'
                }
            )

        # Check overlapping booking
        existing_booking = Booking.objects.filter(
            parking=parking,
            booking_date=booking_date,
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exists()

        if existing_booking:
            return render(
                request,
                'booking.html',
                {
                    'parking': parking,
                    'error': 'This parking space is already booked for this time.'
                }
            )

        # Create booking
        booking = Booking.objects.create(
            user=request.user,
            parking=parking,
            booking_date=booking_date,
            start_time=start_time,
            end_time=end_time
        )

        # Go to confirmation page
        return redirect(
            'booking_confirmation',
            booking_id=booking.id
        )

    return render(
        request,
        'booking.html',
        {'parking': parking}
    )
@login_required
def my_bookings(request):
    bookings = Booking.objects.filter(
        user=request.user
    ).order_by('-created_at')

    return render(
        request,
        'my_bookings.html',
        {'bookings': bookings}
    )
@login_required
def owner_bookings(request):
    bookings = Booking.objects.filter(
        parking__owner=request.user
    ).order_by('-created_at')

    return render(
        request,
        'owner_bookings.html',
        {'bookings': bookings}
    )
@login_required
def update_booking_status(request, booking_id, status):

    booking = Booking.objects.get(id=booking_id)

    # Only the parking owner can update the booking
    if booking.parking.owner != request.user:
        return render(request, 'not_allowed.html')

    if status == 'confirmed':

        booking.status = 'confirmed'

        # Generate a 6-digit OTP
        booking.otp = str(random.randint(100000, 999999))

        booking.otp_verified = False

        booking.save()

    elif status == 'cancelled':

        booking.status = 'cancelled'
        booking.save()

    return redirect('owner_bookings')
@login_required
def verify_otp(request, booking_id):

    booking = Booking.objects.get(id=booking_id)

    # Only booking user can verify OTP
    if booking.user != request.user:
        return render(request, 'not_allowed.html')

    if request.method == "POST":

        entered_otp = request.POST['otp']

        if entered_otp == booking.otp:

            booking.otp_verified = True
            booking.save()

            return render(
                request,
                'otp_success.html',
                {'booking': booking}
            )

        else:

            return render(
                request,
                'verify_otp.html',
                {
                    'booking': booking,
                    'error': 'Invalid OTP'
                }
            )

    return render(
        request,
        'verify_otp.html',
        {'booking': booking}
    )
@login_required
def check_in(request, booking_id):

    booking = Booking.objects.get(id=booking_id)

    # Only the booking user can check in
    if booking.user != request.user:
        return render(request, 'not_allowed.html')

    # Booking must be confirmed
    if booking.status != 'confirmed':
        return render(
            request,
            'not_allowed.html'
        )

    # OTP must be verified first
    if not booking.otp_verified:
        return render(
            request,
            'verify_otp.html',
            {
                'booking': booking,
                'error': 'Please verify OTP before check-in.'
            }
        )

    # Already checked in
    if booking.checked_in:
        return render(
            request,
            'check_in_success.html',
            {'booking': booking}
        )

    # Check parking availability
    parking = booking.parking

    if parking.occupied_slots >= parking.capacity:
        return render(
            request,
            'not_allowed.html'
        )

    # Check in
    booking.checked_in = True
    booking.check_in_time = timezone.now()

    # Increase occupied slots
    parking.occupied_slots += 1
    parking.save()

    booking.save()

    return render(
        request,
        'check_in_success.html',
        {'booking': booking}
    )
@login_required
def check_out(request, booking_id):

    booking = Booking.objects.get(id=booking_id)

    # Only the booking user can check out
    if booking.user != request.user:
        return render(request, 'not_allowed.html')

    # User must have checked in first
    if not booking.checked_in:
        return render(request, 'not_allowed.html')

    # Already checked out
    if booking.checked_out:
        return render(
            request,
            'check_out_success.html',
            {'booking': booking}
        )

    # Check out
    booking.checked_out = True
    booking.check_out_time = timezone.now()

    # Calculate total parking time
    time_difference = (
        booking.check_out_time - booking.check_in_time
    )

    total_minutes = int(
        time_difference.total_seconds() / 60
    )

    booking.total_minutes = total_minutes

    # Calculate total price
    parking = booking.parking

    booking.total_price = (
        total_minutes * parking.price_per_minute
    )
    booking.status = 'completed'

    # Decrease occupied slots
    if parking.occupied_slots > 0:
        parking.occupied_slots -= 1

    # Save parking and booking
    parking.save()
    booking.save()

    return render(
        request,
        'check_out_success.html',
        {'booking': booking}
    )
@login_required
def owner_bookings(request):

    # Only owners can access
    if request.user.role != 'owner':
        return render(request, 'not_allowed.html')

    # Get parking spaces owned by this owner
    parking_spaces = ParkingSpace.objects.filter(
        owner=request.user
    )

    # Get bookings for those parking spaces
    bookings = Booking.objects.filter(
        parking__in=parking_spaces
    ).order_by('-id')

    return render(
        request,
        'owner_bookings.html',
        {
            'bookings': bookings
        }
    )