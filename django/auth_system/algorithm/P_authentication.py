from re import match

from django.contrib.auth.models import User

from auth_system.algorithm import shuffle
from auth_system.models import Auth_user, User_SEED


def mapping(name, password):

    user_obj = User.objects.get(username=name)
    user_seed = User_SEED.objects.get(user=user_obj)
    user_P_model = Auth_user.objects.get(user=user_obj)
    # 假設白色是B
    li = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B']*8
    ll = shuffle.fisher_yates_shuffle(li, int(user_seed.SEED))
    """
    char_li = [
        '~', '`', '!', '1', '@', '2', '#', '3', '$', '4', '%', '5', '^', '6', '&', '7', '*', '8', '(', '9', ')', '0', '_', '-', '+', '=', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', '{', '[', '}', ']', '|', '\\', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', ':', ';', '"', '\'', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm', '<', ',', '>', '.', '?', '/', 'SPACE', 'SPACE'
    ]
    """
    char_str = '~`!1@2#3$4%5^6&7*8(9)0_-+=QqWwEeRrTtYyUuIiOoPp{[}]|\\AaSsDdFfGgHhJjKkLl:;"\'ZzXxCcVvBbNnMm<,>.?/  '
    print(li)
    pattern = ""
    for char in user_P_model.password:
        color_indicator = li[char_str.find(char)]
        if color_indicator == "B":
            pattern += '[0-9A]{1}'
        else:
            pattern += color_indicator
    if re.match(pattern, password):
        return user_P_model.password
    else:
        return None
    # 要檢查同username不同password
