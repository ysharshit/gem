from flask_socketio import emit

from gem.db import sessions
from .chat import SessionChat
from .stages import SessionStages
from .users import SessionUsers


class Session:
    """Represents Session."""

    def __init__(self, session_id):
        """Initializes new instance of the Session class.
        :param session_id: Session Id"""
        self.__session_id = session_id
        self.__stages = SessionStages(self)
        self.__users = SessionUsers(self)
        self.__chat = SessionChat(self)

        # subscribe for aspects' events
        self.__users.changed.subscribe(self.__on_user_state_changed)
        self.__stages.changed.subscribe(self.__on_stage_changed)



    @property
    def session_id(self):
        return self.__session_id

    @property
    def chat(self):
        return self.__chat

    @property
    def stages(self):
        return self.__stages

    @property
    def users(self):
        return self.__users

    @property
    def presence_roles(self):
        session = sessions.get(self.session_id)
        return session["permissions"]["presence"]

    @property
    def vote_roles(self):
        session = sessions.get(self.session_id)
        return session["permissions"]["vote"]

    def close(self):
        session = sessions.get(self.session_id)
        session.status = "closed"
        sessions.save(session)

    def manage(self, data, user):
        if data["command"] == "set_quorum":
            value = data["value"]
            print("QUORUM", value)


    def notify(self, event, data, room=None):
        emit(event, data, room=room or self.__session_id)

    def __on_user_state_changed(self, socket_id, user, joined):
        stage_view = self.__stage_view(self.__stages.current)
        self.notify("stage", stage_view, room=socket_id)

    def __on_stage_changed(self, stage):
        self.notify("stage", self.__stage_view(stage))

    def __stage_view(self, stage):
        stages_count = self.__stages.count
        stage_index = self.__stages.index

        result = {
            "stage": {
                "type": stage.name
            },
            "progress": {
                "index": stage_index + 1,
                "total": stages_count
            }
        }

        if stage.proposal:
            result["proposal_id"] = str(stage.proposal.id)

        result.update(stage.view)
        return result
