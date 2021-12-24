from django import forms


class SteamIDForm(forms.Form):
    steam_id = forms.CharField(min_length=17, max_length=17, widget=forms.TextInput(attrs={'placeholder': 'Steam ID'}))
