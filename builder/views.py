from django.shortcuts import render, redirect
from .scripts.the_backend import make_the_url
from .forms import SteamIDForm


# Create your views here.
def index(response):
    return render(response, 'builder/index.html', {})


def builder(response):
    return render(response, 'builder/builder.html')


def autobuilder(response):
    if response.method == 'GET':
        form = SteamIDForm(response.GET)
        if 'steam_id' in response.GET:
            if len(response.GET['steam_id'].strip()) == 17:
                # RUN METHOD HERE
                print(response.GET['steam_id'])
                print(response.GET['game'])
                multi_sell_page = make_the_url(response.GET['game'], response.GET['steam_id'])
                return redirect(multi_sell_page)
    else:
        form = SteamIDForm()

    return render(response, 'builder/autobuilder.html', {'form': form})


def about(response):
    return render(response, 'builder/about.html', {})
