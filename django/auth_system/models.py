from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib import admin


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.title

    def publish(self):
        self.published_date = timezone.now
        self.save()


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Post._meta.fields]
    list_filter = ('author',)


class User_SEED(models.Model):
    user = models.ForeignKey(
        User, related_name='user_seed', on_delete=models.CASCADE)
    name = models.CharField(max_length=512, null=True)
    Server_Random = models.CharField(max_length=512, null=True)
    Client_Random = models.CharField(max_length=512, null=True)
    SEED = models.CharField(max_length=512, null=True)
    expires = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.name


@admin.register(User_SEED)
class User_SEED_Admin(admin.ModelAdmin):
    list_display = [field.name for field in User_SEED._meta.fields]
    list_filter = ('name',)


class Auth_user(models.Model):
    user = models.ForeignKey(
        User, related_name='Auth_user', on_delete=models.CASCADE)
    username = models.CharField(max_length=512, null=True)
    password = models.CharField(max_length=512, null=True)


@admin.register(Auth_user)
class Auth_user_Admin(admin.ModelAdmin):
    list_display = [field.name for field in Auth_user._meta.fields]
    list_filter = ('username',)
