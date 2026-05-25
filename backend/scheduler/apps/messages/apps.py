from django.apps import AppConfig


class MessagesAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'scheduler.apps.messages'
    label = 'school_messages'
