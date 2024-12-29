# random_number/views.py
import random
from django.shortcuts import render

def generate_random_number(request):
    # Generate a random number between 1 and 100
    random_number = random.randint(1, 100)
    
    # Render the number in a template
    return render(request, 'random_number/random_number.html', {'random_number': random_number})
