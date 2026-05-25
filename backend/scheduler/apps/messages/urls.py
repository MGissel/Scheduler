from django.urls import path
from .views import InboxView, SentView, MessageCreateView, MessageDetailView, MessageMarkReadView

urlpatterns = [
    path("inbox/",             InboxView.as_view(),          name="message-inbox"),
    path("sent/",              SentView.as_view(),           name="message-sent"),
    path("compose/",           MessageCreateView.as_view(),  name="message-compose"),
    path("<uuid:pk>/",         MessageDetailView.as_view(),  name="message-detail"),
    path("<uuid:pk>/read/",    MessageMarkReadView.as_view(), name="message-read"),
]