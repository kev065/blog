
from typing import Callable, Any

def posts_key_builder(
    func: Callable[..., Any],
    *args: Any,
    **kwargs: Any,
) -> str:
    """
    Creates a cache key for get_posts, using only skip and limit.
    """
    skip = kwargs.get("skip", 0)
    limit = kwargs.get("limit", 100)
    return f"{func.__module__}:{func.__name__}:{skip}:{limit}"

def post_key_builder(
    func: Callable[..., Any],
    *args: Any,
    **kwargs: Any,
) -> str:
    """
    Creates a cache key for get_post, using only post_id.
    """
    post_id = kwargs.get("post_id")
    return f"{func.__module__}:{func.__name__}:{post_id}"

def comments_key_builder(
    func: Callable[..., Any],
    *args: Any,
    **kwargs: Any,
) -> str:
    """
    Creates a cache key for get_comments_for_post, using post_id, skip, and limit.
    """
    post_id = kwargs.get("post_id")
    skip = kwargs.get("skip", 0)
    limit = kwargs.get("limit", 10)
    return f"{func.__module__}:{func.__name__}:{post_id}:{skip}:{limit}"

def comment_key_builder(
    func: Callable[..., Any],
    *args: Any,
    **kwargs: Any,
) -> str:
    """
    Creates a cache key for get_comment, using only comment_id.
    """
    comment_id = kwargs.get("comment_id")
    return f"{func.__module__}:{func.__name__}:{comment_id}"

def users_key_builder(
    func: Callable[..., Any],
    *args: Any,
    **kwargs: Any,
) -> str:
    """
    Creates a cache key for get_users, using only skip and limit.
    """
    skip = kwargs.get("skip", 0)
    limit = kwargs.get("limit", 100)
    return f"{func.__module__}:{func.__name__}:{skip}:{limit}"

def user_key_builder(
    func: Callable[..., Any],
    *args: Any,
    **kwargs: Any,
) -> str:
    """
    Creates a cache key for get_user, using only user_id.
    """
    user_id = kwargs.get("user_id")
    return f"{func.__module__}:{func.__name__}:{user_id}"

def user_by_email_key_builder(
    func: Callable[..., Any],
    *args: Any,
    **kwargs: Any,
) -> str:
    """
    Creates a cache key for get_user_by_email, using only email.
    """
    email = kwargs.get("email")
    return f"{func.__module__}:{func.__name__}:{email}"
