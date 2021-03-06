from gem.db import roles, users
from gem.db.config import laws

roles.insert({
    "name" : "Secretary",
    "permissions" : [
        "proposals.create",
        "proposals.read",
        "proposals.update",
        "proposals.delete",
        "users.create",
        "users.read",
        "users.update",
        "users.delete",
        "sessions.create",
        "sessions.read",
        "sessions.update",
        "sessions.delete",
        "session.manage",
        "roles.create",
        "roles.read",
        "roles.update",
        "roles.delete"
    ]
})

users.insert({
    "name": "Secretary das",
    "login": "secretary",
    "password": "pwd",
    "role": "Secretary"
})

laws.create_index([('$**','text')])
