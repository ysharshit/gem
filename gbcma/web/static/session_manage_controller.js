function extendSessionController(me) {
    me.nextStageLabel = $("#state-next")

    me.onChangeStageResponse = function(data) {
        console.log(data);
        if (data.next.title != data.current.title) {
            var title = data.next.title ? " &laquo;" + data.next.title + "&raquo;" : ""
            me.nextStageLabel.html(title)
        } else {
            var type = data.next.type ? " (" + data.next.type + ")" : ""
            me.nextStageLabel.html(type)
        }
    }

    me.onCloseSessionResponse = function(data) {
        //console.log(data)
    }


    // Actions ---------------------------------------------------------------------------------------------------------

    me.changeStage = function(value) {
        me.socket.emit("change_stage", { value: value }, me.onChangeStageResponse)
    }

    me.closeSession = function() {
        me.socket.emit("close", me.onCloseSessionResponse)
    }

    me.giveVoice = function(user_id) {
        me.socket.emit("give_voice", { user_id: user_id })
    }

    return me
}

$(document).ready(function() {
    extendSessionController(controller)

    $(".change-stage").on("click", function(e) {
        e.preventDefault()
        var value = $(this).data("value")
        controller.changeStage(value)
    })

    $(".run-close").on("click", function(e) {
        e.preventDefault()
        controller.closeSession()
    })

    $("#stage").on("click", ".run-close", function(e) {
        e.preventDefault()
        controller.closeSession()
    })

    $("#stage").on("click", ".discussion-give-voice", function(e) {
        e.preventDefault()
        var id = $(this).data("user-id")
        controller.giveVoice(id)
    })

    Handlebars.registerPartial('agenda', $("#stage-agenda").html())
    Handlebars.registerPartial('acquaintance', $("#stage-acquaintance").html())
    Handlebars.registerPartial('voting', $("#stage-voting").html())
    Handlebars.registerPartial('commenting', $("#stage-commenting").html())
    Handlebars.registerPartial('discussion', $("#stage-discussion").html())
    Handlebars.registerPartial('closed', $("#stage-closed").html())
})
