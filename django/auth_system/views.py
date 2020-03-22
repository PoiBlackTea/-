from decimal import *
from math import pow
from secrets import randbits as _randbits
from traceback import print_exc

from django.contrib import auth
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from _sha256 import sha256

from .algorithm import P_and_PC_authentication, shuffle
from .forms import CustomUserCreationForm
from .models import Auth_user, User_SEED


def index(request):
    return render(request, 'auth_system/index.html')


def login(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect('index')
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')

    P_model_password = request.POST.get('value', '')
    if P_model_password and username:
        password = P_and_PC_authentication.mapping(username, P_model_password)
    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        auth.login(request, user)
        return HttpResponseRedirect('index')
    else:
        return render(request, 'auth_system/login.html', locals())


def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/auth_system/index')


def User_register_view(request):
    form = CustomUserCreationForm(request.POST or None)
    if form.is_valid():
        register_user = User.objects.create_user(
            username=form.cleaned_data['username'], password=form.cleaned_data['password1'], email=form.cleaned_data['email'])
        user_s = User_SEED.objects.create(
            user=register_user, name='Auth System')
        auth_user = Auth_user.objects.create(
            user=register_user, username=form.cleaned_data['username'], password=form.cleaned_data['password1'])
        register_user.save()
        user_s.save()
        auth_user.save()
        return HttpResponseRedirect('/auth_system/index')
    else:
        return render(request, 'auth_system/register.html', {'form': form})


@csrf_exempt
def Server_create_SEED(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect('/auth_system/index')
    user_name = request.POST.get('username', '')
    client_random = request.POST.get('client random', '')
    if user_name and client_random:
        user_obj = User.objects.get(username=user_name)
        user_seed = User_SEED.objects.get(user=user_obj)
        serv_random = _randbits(256)
        user_seed.Server_Random = str(serv_random)
        user_seed.Client_Random = str(client_random)
        # something make trouble, maybe the SEED. this way i let SEED < 2**32.
        user_seed.SEED = Decimal(int(sha256(f'{client_random}{serv_random}'.encode(
        )).hexdigest()[-10:], 16)) % Decimal(4294967296)
        user_seed.save()

        return HttpResponse(serv_random)

    return render(request, 'auth_system/Server_Random.html', locals())
