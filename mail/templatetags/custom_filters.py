from django import template 
from mail.models import User, Email

register = template.Library()


@register.filter
def check_for_profile_picture(value):
    ids_with_pics = [3, 4, 5, 6, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21]
    return value in ids_with_pics


@register.filter
def parse_username_from_email(email):
    return email.split('@')[0].lower()