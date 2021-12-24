import requests
import urllib.parse
import json
import os


def make_the_url(game, steam_id):
    appid_dct = {"csgo": 730,
                 "rust": 252490,
                 "tf2": 440,
                 "ut": 304930}
    item_lst = []

    DIRNAME = os.path.dirname(__file__)
    with open(os.path.join(DIRNAME, f'{game}_ab.json'), 'r') as f:
        master_lst = json.load(f)

    # Request inventory from steam
    # TODO: apply for API key, prevent rate limiting
    url = f'https://steamcommunity.com/inventory/{steam_id}/{appid_dct[game]}/2?l=english&count=5000'
    r = requests.get(url).json()

    # Compare all items to the master list, might have to change to a set later
    for item in r['descriptions']:
        if item['market_hash_name'] in master_lst and item['marketable'] == 1:
            item_lst.append(urllib.parse.quote(item['market_hash_name']))

    completed_items = '&items[]='.join(set(item_lst))
    multi_sell = f'https://steamcommunity.com/market/multisell?appid={appid_dct[game]}&contextid=2&items[]={completed_items}'

    return multi_sell
