def decorator(caller):
    """decorator(caller) converts a caller function into a decorator"""
    def wrap(real_fn):
        def wrapped(*args, **kwargs):
            return caller(real_fn, *args, **kwargs)
        return wrapped
    return wrap
